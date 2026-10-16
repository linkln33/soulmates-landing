'use client';

import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { submitAnswers, type PublicQuiz, type QuizQuestion, type SubmitOutcome } from '@/lib/quiz/api';
import { checkBirthDate, type BirthDateParts } from '@/lib/quiz/birthDate';
import { todayInSofia } from '@/lib/blueprint/dates';
import { messages, retentionMonths, type Lang, type Messages } from '@/lib/quiz/messages';
import CardPattern from './CardPattern';

const NAME_MIN = 2;
const NAME_MAX = 60;
const ANSWER_MAX = 500;
const AUTO_ADVANCE_MS = 300;

type Step =
  | { kind: 'intro' }
  | { kind: 'name' }
  | { kind: 'birth' }
  | { kind: 'question'; index: number }
  | { kind: 'custom'; index: number }
  | { kind: 'consent' }
  | { kind: 'sent' };

type Answer = string | string[];

function minOf(q: QuizQuestion): number {
  return q.type === 'multiple' ? Math.max(1, q.min ?? 1) : 1;
}

function isAnswered(q: QuizQuestion, value: Answer | undefined): boolean {
  if (q.type === 'multiple') return Array.isArray(value) && value.length >= minOf(q);
  return typeof value === 'string' && value !== '';
}

function nameError(value: string, m: Messages): string | null {
  const trimmed = value.trim();
  if (trimmed.length < NAME_MIN) return m.nameTooShort;
  if (trimmed.length > NAME_MAX) return m.nameTooLong;
  return null;
}

function outcomeMessage(outcome: Exclude<SubmitOutcome, { kind: 'sent' }>, m: Messages): string {
  switch (outcome.kind) {
    case 'invalid': return m.errCheck;
    case 'full': return m.errFull;
    case 'paused': return m.errPaused;
    case 'not_found': return m.errNotFound;
    case 'rate_limited': return m.errRate;
    case 'error': return outcome.network ? m.errNetwork : m.errGeneric;
  }
}

export default function QuizFlow({ code, data, lang }: { code: string; data: PublicQuiz; lang: Lang }) {
  const m = messages(lang);
  const creator = data.quiz.creatorName;
  const questions = data.questions.questions;
  const custom = data.customQuestions;
  const months = retentionMonths(data.consent.retentionDays);

  const steps = useMemo<Step[]>(
    () => [
      { kind: 'intro' },
      { kind: 'name' },
      { kind: 'birth' },
      ...questions.map((_, index) => ({ kind: 'question' as const, index })),
      ...custom.map((_, index) => ({ kind: 'custom' as const, index })),
      { kind: 'consent' },
      { kind: 'sent' },
    ],
    [questions, custom],
  );
  // Progress counts the steps between the intro and the "sent" screen.
  const totalSteps = steps.length - 2;

  const [stepIndex, setStepIndex] = useState(0);
  const [stepError, setStepError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [birth, setBirth] = useState<BirthDateParts>({ day: '', month: '', year: '' });
  const [birthIso, setBirthIso] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<{ text: string; reference: string | null } | null>(null);
  const [sent, setSent] = useState<{ creatorName: string; deletionUrl: string | null } | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const movedOnce = useRef(false);

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  // Move focus to the new step's heading so keyboard and screen-reader users land on it.
  useEffect(() => {
    if (!movedOnce.current) {
      movedOnce.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [stepIndex]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  function cancelAdvance() {
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
  }

  function goTo(index: number) {
    cancelAdvance();
    setStepError(null);
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  }

  const next = () => goTo(stepIndex + 1);
  const back = () => goTo(stepIndex - 1);

  // ── Step handlers ──────────────────────────────────────────

  function submitName(e: FormEvent) {
    e.preventDefault();
    setNameTouched(true);
    const err = nameError(name, m);
    if (err) {
      setStepError(err);
      return;
    }
    next();
  }

  function birthErrorText(error: 'incomplete' | 'invalid' | 'range'): string {
    return error === 'incomplete' ? m.birthIncomplete : error === 'invalid' ? m.birthInvalid : m.birthRange;
  }

  function submitBirth(e: FormEvent) {
    e.preventDefault();
    const check = checkBirthDate(birth, todayInSofia());
    if (!check.ok) {
      setStepError(birthErrorText(check.error));
      return;
    }
    setBirthIso(check.iso);
    next();
  }

  function skipBirth() {
    setBirth({ day: '', month: '', year: '' });
    setBirthIso(null);
    next();
  }

  function chooseSingle(q: QuizQuestion, optionId: string) {
    setAnswers((prev) => ({ ...prev, [q.id]: optionId }));
    setStepError(null);
    cancelAdvance();
    const from = stepIndex;
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      setStepIndex((current) => (current === from ? from + 1 : current));
    }, AUTO_ADVANCE_MS);
  }

  function toggleMultiple(q: QuizQuestion, optionId: string) {
    setAnswers((prev) => {
      const current = Array.isArray(prev[q.id]) ? (prev[q.id] as string[]) : [];
      const nextValue = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [q.id]: nextValue };
    });
    setStepError(null);
  }

  function submitQuestion(q: QuizQuestion) {
    if (!isAnswered(q, answers[q.id])) {
      setStepError(q.type === 'multiple' ? m.answerAtLeast(minOf(q)) : m.answerRequired);
      return;
    }
    next();
  }

  function submitCustom(e: FormEvent, id: string) {
    e.preventDefault();
    if (!(customAnswers[id] ?? '').trim()) {
      setStepError(m.customRequired);
      return;
    }
    next();
  }

  async function send(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    if (!agreed) {
      setStepError(m.agreeRequired);
      return;
    }
    // Every earlier step must be complete (they are, unless the page state was tampered with).
    const firstMissing = questions.findIndex((q) => !isAnswered(q, answers[q.id]));
    if (nameError(name, m) || firstMissing !== -1 || custom.some((c) => !(customAnswers[c.id] ?? '').trim())) {
      setSubmitError({ text: m.errCheck, reference: null });
      return;
    }
    setStepError(null);
    setSubmitError(null);
    setSubmitting(true);
    const outcome = await submitAnswers(code, {
      respondentName: name.trim(),
      answers: Object.fromEntries(questions.map((q) => [q.id, answers[q.id]])),
      ...(custom.length > 0
        ? { customAnswers: custom.map((c) => ({ questionId: c.id, answer: customAnswers[c.id].trim() })) }
        : {}),
      ...(birthIso ? { birthDate: birthIso } : {}),
      consent: { version: data.consent.version },
      locale: lang,
      website: honeypot,
    });
    setSubmitting(false);
    if (outcome.kind === 'sent') {
      setSent({ creatorName: outcome.creatorName || creator, deletionUrl: outcome.deletionUrl });
      goTo(steps.length - 1);
      return;
    }
    setSubmitError({
      text: outcomeMessage(outcome, m),
      reference: outcome.kind === 'error' ? outcome.correlationId : null,
    });
  }

  // ── Rendering ──────────────────────────────────────────────

  const showProgress = step.kind !== 'intro' && step.kind !== 'sent';
  const stepLabel = showProgress ? m.stepOf(stepIndex, totalSteps) : '';

  let body: ReactNode;
  let eyebrow = m.cardEyebrow(creator);

  switch (step.kind) {
    case 'intro': {
      const count = questions.length + custom.length;
      body = (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title lx-title-lg">{m.introTitle(creator)}</h1>
          <p className="lx-lead">{m.introLead(creator)}</p>
          <ul className="lx-meta">
            <li>{m.questionCount(count)}</li>
            <li>{m.duration}</li>
          </ul>
          <p className="lx-note">{m.dataNote(creator)}</p>
          <details className="lx-details">
            <summary>{m.dataMore}</summary>
            <p>{m.consentText(creator, months)}</p>
          </details>
          <div className="lx-actions">
            <button type="button" className="lx-btn lx-btn-primary" onClick={next}>{m.start}</button>
          </div>
        </>
      );
      break;
    }

    case 'name': {
      const inlineError = stepError ?? (nameTouched && name.trim() !== '' ? nameError(name, m) : null);
      body = (
        <form onSubmit={submitName} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title">{m.nameTitle}</h1>
          <p className="lx-sub">{m.nameHint(creator)}</p>
          <div className="lx-field">
            <label htmlFor="lx-name">{m.nameLabel}</label>
            <input
              id="lx-name"
              className="lx-input"
              type="text"
              name="respondentName"
              autoComplete="given-name"
              maxLength={NAME_MAX}
              value={name}
              aria-invalid={inlineError ? true : undefined}
              aria-describedby={inlineError ? 'lx-name-error' : undefined}
              onChange={(e) => {
                setName(e.target.value);
                if (stepError) setStepError(null);
              }}
              onBlur={() => setNameTouched(true)}
            />
            {inlineError && <p id="lx-name-error" className="lx-error" role="alert">{inlineError}</p>}
          </div>
          <div className="lx-actions">
            <button type="submit" className="lx-btn lx-btn-primary">{m.next}</button>
          </div>
        </form>
      );
      break;
    }

    case 'birth': {
      const set = (key: keyof BirthDateParts) => (e: ChangeEvent<HTMLInputElement>) => {
        setBirth((prev) => ({ ...prev, [key]: e.target.value.replace(/\D/g, '') }));
        if (stepError) setStepError(null);
      };
      const describedBy = stepError ? 'lx-birth-reason lx-birth-error' : 'lx-birth-reason';
      body = (
        <form onSubmit={submitBirth} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title">
            {m.birthTitle} <span className="lx-optional">({m.optional})</span>
          </h1>
          <p id="lx-birth-reason" className="lx-sub">{m.birthReason(creator)}</p>
          <fieldset className="lx-date" aria-describedby={describedBy}>
            <legend className="lx-visually-hidden">{m.birthLegend}</legend>
            <div className="lx-field">
              <label htmlFor="lx-bd-day">{m.day}</label>
              <input id="lx-bd-day" className="lx-input" inputMode="numeric" autoComplete="bday-day" maxLength={2} placeholder="DD" value={birth.day} onChange={set('day')} aria-invalid={stepError ? true : undefined} />
            </div>
            <div className="lx-field">
              <label htmlFor="lx-bd-month">{m.month}</label>
              <input id="lx-bd-month" className="lx-input" inputMode="numeric" autoComplete="bday-month" maxLength={2} placeholder="MM" value={birth.month} onChange={set('month')} aria-invalid={stepError ? true : undefined} />
            </div>
            <div className="lx-field lx-field-year">
              <label htmlFor="lx-bd-year">{m.year}</label>
              <input id="lx-bd-year" className="lx-input" inputMode="numeric" autoComplete="bday-year" maxLength={4} placeholder="YYYY" value={birth.year} onChange={set('year')} aria-invalid={stepError ? true : undefined} />
            </div>
          </fieldset>
          {stepError && <p id="lx-birth-error" className="lx-error" role="alert">{stepError}</p>}
          <div className="lx-actions lx-actions-split">
            <button type="button" className="lx-btn lx-btn-secondary" onClick={skipBirth}>{m.skip}</button>
            <button type="submit" className="lx-btn lx-btn-primary">{m.next}</button>
          </div>
        </form>
      );
      break;
    }

    case 'question': {
      const q = questions[step.index];
      const value = answers[q.id];
      const multiple = q.type === 'multiple';
      const selected = (id: string) => (multiple ? Array.isArray(value) && value.includes(id) : value === id);
      const hint = multiple ? m.chooseMany(minOf(q)) : m.chooseOne;
      eyebrow = m.questionOf(step.index + 1, questions.length);
      body = (
        <>
          <div lang="en">
            <h1 ref={headingRef} tabIndex={-1} className="lx-title" id="lx-q-title">
              <span className="lx-emoji" aria-hidden="true">{q.emoji}</span> {q.text.en.question}
            </h1>
            {q.text.en.subtitle && <p className="lx-sub">{q.text.en.subtitle}</p>}
          </div>
          <p className="lx-hint" id="lx-q-hint">{hint}</p>
          {m.translationNote && <p className="lx-translation">{m.translationNote}</p>}
          <div className={multiple ? 'lx-chips' : 'lx-options'} role="group" aria-labelledby="lx-q-title" aria-describedby="lx-q-hint" lang="en">
            {q.options.map((o) => (
              <button
                key={o.id}
                type="button"
                className={multiple ? 'lx-chip' : 'lx-option'}
                aria-pressed={selected(o.id)}
                onClick={() => (multiple ? toggleMultiple(q, o.id) : chooseSingle(q, o.id))}
              >
                {o.emoji && <span className="lx-emoji" aria-hidden="true">{o.emoji}</span>}
                <span className="lx-option-text">
                  <span className="lx-option-label">{o.text.en.label}</span>
                  {o.text.en.description && <span className="lx-option-desc">{o.text.en.description}</span>}
                </span>
              </button>
            ))}
          </div>
          {stepError && <p className="lx-error" role="alert">{stepError}</p>}
          <div className="lx-actions">
            <button type="button" className="lx-btn lx-btn-primary" onClick={() => submitQuestion(q)}>{m.next}</button>
          </div>
        </>
      );
      break;
    }

    case 'custom': {
      const c = custom[step.index];
      const value = customAnswers[c.id] ?? '';
      eyebrow = m.customEyebrow(creator);
      body = (
        <form onSubmit={(e) => submitCustom(e, c.id)} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title lx-custom-q">
            {c.emoji && <span className="lx-emoji" aria-hidden="true">{c.emoji}</span>} {c.question}
          </h1>
          <div className="lx-field">
            <label htmlFor={`lx-custom-${c.id}`}>{m.customLabel}</label>
            <textarea
              id={`lx-custom-${c.id}`}
              className="lx-input lx-textarea"
              rows={5}
              maxLength={ANSWER_MAX}
              value={value}
              aria-invalid={stepError ? true : undefined}
              aria-describedby={`lx-custom-count${stepError ? ' lx-custom-error' : ''}`}
              onChange={(e) => {
                const text = e.target.value.slice(0, ANSWER_MAX);
                setCustomAnswers((prev) => ({ ...prev, [c.id]: text }));
                if (stepError) setStepError(null);
              }}
            />
            <p id="lx-custom-count" className="lx-counter">{m.charCount(value.length, ANSWER_MAX)}</p>
            {stepError && <p id="lx-custom-error" className="lx-error" role="alert">{stepError}</p>}
          </div>
          <div className="lx-actions">
            <button type="submit" className="lx-btn lx-btn-primary">{m.next}</button>
          </div>
        </form>
      );
      break;
    }

    case 'consent': {
      body = (
        <form onSubmit={send} noValidate>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title">{m.consentTitle}</h1>
          <p className="lx-consent" id="lx-consent-text">{m.consentText(creator, months)}</p>
          <label className="lx-check">
            <input
              type="checkbox"
              checked={agreed}
              required
              aria-describedby="lx-consent-text"
              aria-invalid={stepError ? true : undefined}
              onChange={(e) => {
                setAgreed(e.target.checked);
                if (stepError) setStepError(null);
              }}
            />
            <span>{m.agree}</span>
          </label>
          <div className="lx-hp" aria-hidden="true">
            <label htmlFor="lx-website">{m.honeypotLabel}</label>
            <input id="lx-website" type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
          </div>
          {stepError && <p className="lx-error" role="alert">{stepError}</p>}
          {submitError && (
            <div className="lx-error-box" role="alert">
              <p>{submitError.text}</p>
              {submitError.reference && <p className="lx-ref">{m.reference(submitError.reference)}</p>}
            </div>
          )}
          <div className="lx-actions">
            <button type="submit" className="lx-btn lx-btn-primary" disabled={submitting} aria-busy={submitting || undefined}>
              {submitting ? m.sending : submitError ? m.retry : m.send}
            </button>
          </div>
        </form>
      );
      break;
    }

    case 'sent': {
      const who = sent?.creatorName || creator;
      eyebrow = '';
      body = (
        <>
          <h1 ref={headingRef} tabIndex={-1} className="lx-title lx-title-lg">
            <span className="lx-emoji" aria-hidden="true">💌</span> {m.sentTitle(who)}
          </h1>
          <p className="lx-lead">{m.sentLead}</p>
          {sent?.deletionUrl && <DeletionLinkBox url={sent.deletionUrl} m={m} />}
          <div className="lx-actions lx-actions-stack">
            <Link href="/app" className="lx-btn lx-btn-primary">{m.getApp}</Link>
            <Link href="/app" className="lx-btn lx-btn-ghost">{m.makeOwn}</Link>
          </div>
        </>
      );
      break;
    }
  }

  return (
    <div className="lx-flow">
      {showProgress && (
        <div className="lx-stepbar">
          <button type="button" className="lx-btn lx-btn-back" onClick={back} disabled={submitting}>
            <span aria-hidden="true">←</span> {m.back}
          </button>
          <span className="lx-steptext">{stepLabel}</span>
        </div>
      )}
      {showProgress && (
        <div
          className="lx-progress"
          role="progressbar"
          aria-label={stepLabel}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={stepIndex}
        >
          <div className="lx-progress-fill" style={{ width: `${(stepIndex / totalSteps) * 100}%` }} />
        </div>
      )}
      <p className="lx-visually-hidden" aria-live="polite">{stepLabel}</p>
      <section className="lx-card" key={stepIndex}>
        <div className="lx-card-head">
          <span className="lx-eyebrow">{eyebrow}</span>
          <CardPattern />
        </div>
        <div className="lx-card-body">{body}</div>
      </section>
    </div>
  );
}

function DeletionLinkBox({ url, m }: { url: string; m: Messages }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
    } catch {
      inputRef.current?.focus();
      inputRef.current?.select();
      setCopyState('manual');
    }
  }

  return (
    <div className="lx-delete-box">
      <p>{m.deletionBox}</p>
      <label htmlFor="lx-deletion-url" className="lx-visually-hidden">{m.deletionLabel}</label>
      <div className="lx-copy-row">
        <input
          id="lx-deletion-url"
          ref={inputRef}
          className="lx-input lx-url"
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button type="button" className="lx-btn lx-btn-secondary" onClick={copy}>
          {copyState === 'copied' ? m.copied : m.copy}
        </button>
      </div>
      <p className="lx-copy-status" aria-live="polite">
        {copyState === 'copied' ? m.copied : copyState === 'manual' ? m.copyManual : ''}
      </p>
      <a href={url} className="lx-link">{m.openLink}</a>
    </div>
  );
}
