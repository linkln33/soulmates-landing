'use client';

/**
 * Numbers (public /numbers, numerology-v1 on the server): life path and the
 * personal year, month and day from a birth date. The birth date goes in the
 * request body and is not kept in this browser either.
 */
import { useState } from 'react';
import type { Locale } from '@/i18n/config';
import { app, dates, fmt, site } from '@/i18n';
import { fetchNumbers, visitorZone, type ApiError, type NumbersResponse } from '@/lib/readings/api';
import { localDay } from '@/lib/readings/local';
import { AppInvite, ErrorState, Loading } from '@/components/site/Bits';
import PatternCard from '@/components/site/PatternCard';

const MIN = '1900-01-01';

function isRealDate(ymd: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
  if (!m) return false;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(Date.UTC(y, mo - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === mo - 1 && date.getUTCDate() === d;
}

type Phase = { kind: 'idle' } | { kind: 'loading' } | { kind: 'done'; data: NumbersResponse } | { kind: 'error'; error: ApiError };

function Result({ lang, data }: { lang: Locale; data: NumbersResponse }) {
  const a = app(lang).numbersReading;
  const d = dates(lang);
  const r = data.reading;
  const lp = a.lifePath[`n${r.lifePath.number}` as keyof typeof a.lifePath];
  const day = a.day[`d${r.personalDay}` as keyof typeof a.day];
  return (
    <div className="stack" aria-live="polite">
      <PatternCard tint="pink" motif="crown">
        <div className="stack">
          <p className="small subtle">{a.lifePathLabel}</p>
          <div className="number-hero">
            <span className="number-badge" aria-hidden>{r.lifePath.number}</span>
            <div>
              <h2 className="title">{lp ? lp.title : r.lifePath.number}</h2>
              {lp ? <p className="muted" style={{ marginTop: 4 }}>{lp.body}</p> : null}
            </div>
          </div>
          <p className="small muted">{fmt(a.howLifePath, { parts: r.lifePath.parts.join(' + '), total: r.lifePath.total })}</p>
        </div>
      </PatternCard>
      <PatternCard tint="teal" motif="diamond">
        <div className="stack">
          <h2 className="heading">{d.calendar(data.date)}</h2>
          <div className="cycle">
            <div><p className="n">{r.personalYear}</p><p className="small muted">{a.yearLabel}</p></div>
            <div><p className="n">{r.personalMonth}</p><p className="small muted">{a.monthLabel}</p></div>
            <div><p className="n">{r.personalDay}</p><p className="small muted">{a.dayLabel}</p></div>
          </div>
          {day ? (
            <div>
              <h3 className="heading">{day.title}</h3>
              <p className="muted" style={{ marginTop: 4 }}>{day.body}</p>
            </div>
          ) : null}
          <p className="small muted">{a.howCycle}</p>
          <p className="small subtle">{a.note}</p>
        </div>
      </PatternCard>
    </div>
  );
}

export default function NumbersTool({ lang }: { lang: Locale }) {
  const t = site(lang).numbers;
  const [birth, setBirth] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [phase, setPhase] = useState<Phase>({ kind: 'idle' });

  async function submit() {
    const today = localDay(visitorZone());
    if (!birth) return setFieldError(t.missing);
    if (!isRealDate(birth) || birth < MIN || birth > today) return setFieldError(t.invalid);
    setFieldError('');
    setPhase({ kind: 'loading' });
    const result = await fetchNumbers(birth, visitorZone());
    if (!result.ok) {
      if (result.error.kind === 'invalid') { setPhase({ kind: 'idle' }); return setFieldError(t.invalid); }
      return setPhase({ kind: 'error', error: result.error });
    }
    setPhase({ kind: 'done', data: result.data });
  }

  return (
    <div className="stack-lg">
      <PatternCard tint="plain">
        <form className="stack" noValidate onSubmit={(e) => { e.preventDefault(); void submit(); }}>
          <div className="field" style={{ maxWidth: 320 }}>
            <label htmlFor="birth">{t.birthLabel}</label>
            <input
              id="birth"
              className="input"
              type="date"
              min={MIN}
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              aria-invalid={fieldError ? true : undefined}
              aria-describedby="birth-help birth-error"
              autoComplete="bday"
            />
            <p id="birth-error" className="field-error" role="alert">{fieldError}</p>
            <p id="birth-help" className="small subtle">{t.privacy}</p>
          </div>
          <div className="row">
            <button type="submit" className="btn btn-primary" disabled={phase.kind === 'loading'}>{t.calculate}</button>
            {phase.kind === 'done' ? (
              <button type="button" className="btn btn-quiet" onClick={() => { setBirth(''); setPhase({ kind: 'idle' }); }}>{t.again}</button>
            ) : null}
          </div>
          <p className="small subtle">{t.nameNote}</p>
        </form>
      </PatternCard>
      {phase.kind === 'loading' ? <div className="card"><Loading lang={lang} lines={4} /></div> : null}
      {phase.kind === 'error' ? <ErrorState lang={lang} kind={phase.error.kind} onRetry={submit} /> : null}
      {phase.kind === 'done' ? <><Result lang={lang} data={phase.data} /><AppInvite lang={lang} tool="numbers" /></> : null}
    </div>
  );
}
