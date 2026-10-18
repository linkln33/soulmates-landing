'use client';

/**
 * Tarot in the browser.
 *  - TarotDaily: card of the day (daily-tarot v2 on the server) for this
 *    browser's random visitor identifier and local day. Kept locally so it
 *    shows again without a request; a new local day asks for a new card.
 *  - TarotDraw: a deliberate one- or three-card draw (tarot-draw-v1). The
 *    completed draw and the optional question stay in this browser, so a
 *    refresh shows the same reading; only "New reading" starts another.
 * Card texts load on demand (they are large) from the synced app content.
 */
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { app, dates, fmt, site } from '@/i18n';
import type { TarotCardView } from '@/content/tarotKeys';
import { drawCards, fetchDailyCard, visitorZone, type ApiError, type TarotDailyResponse, type TarotDrawResponse } from '@/lib/readings/api';
import { clearDraw, readDaily, readDraw, saveDaily, saveDraw, visitorId } from '@/lib/readings/local';
import { AppInvite, ErrorState, Loading } from '@/components/site/Bits';
import PatternCard from '@/components/site/PatternCard';
import { TarotCredit, TarotFace, TarotMeaning } from './TarotCard';

type CardLookup = (key: string, lang: Locale) => TarotCardView | null;

/** The card-text lookup, loaded once on demand. */
function useCardTexts(): CardLookup | null {
  const [lookup, setLookup] = useState<CardLookup | null>(null);
  useEffect(() => {
    let live = true;
    import('@/content/tarot').then((m) => { if (live) setLookup(() => m.tarotCard); });
    return () => { live = false; };
  }, []);
  return lookup;
}

type Phase<T> = { kind: 'idle' } | { kind: 'loading' } | { kind: 'done'; data: T } | { kind: 'error'; error: ApiError };

// ── Card of the day ─────────────────────────────────────────

/** Shape check for a stored daily card (anything else is cleared). */
const isDailyData = (d: unknown): d is TarotDailyResponse =>
  typeof d === 'object' && d !== null && typeof (d as TarotDailyResponse).date === 'string' &&
  typeof (d as TarotDailyResponse).card?.key === 'string';

export function TarotDaily({ lang }: { lang: Locale }) {
  const t = site(lang).tarot;
  const texts = useCardTexts();
  const [phase, setPhase] = useState<Phase<TarotDailyResponse>>({ kind: 'idle' });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Show today's card again if this browser already revealed it (until local midnight).
    const stored = readDaily(visitorZone(), isDailyData);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setPhase({ kind: 'done', data: stored.data });
    setChecked(true);
  }, []);

  async function reveal() {
    setPhase({ kind: 'loading' });
    const id = visitorId();
    const tz = visitorZone();
    const result = await fetchDailyCard(id, tz);
    if (!result.ok) return setPhase({ kind: 'error', error: result.error });
    saveDaily(id, result.data.date, tz, result.data);
    setPhase({ kind: 'done', data: result.data });
  }

  const card = phase.kind === 'done' && texts ? texts(phase.data.card.key, lang) : null;
  return (
    <div className="stack">
    <PatternCard tint="teal" aria-label={t.dailyTitle}>
      <div className="stack">
        <h2 className="title">{t.dailyTitle}</h2>
        <p className="muted">{t.dailyLead}</p>
        {phase.kind === 'idle' && checked ? (
          <div><button type="button" className="btn btn-primary" onClick={reveal}>{t.reveal}</button></div>
        ) : null}
        {phase.kind === 'loading' || (phase.kind === 'done' && !card) ? <Loading lang={lang} lines={4} /> : null}
        {phase.kind === 'error' ? <ErrorState lang={lang} kind={phase.error.kind} onRetry={reveal} /> : null}
        {phase.kind === 'done' && card ? (
          <div className="tarot-result" aria-live="polite">
            <TarotFace cardKey={card.key} name={card.text.name} orientation={phase.data.card.orientation} priority width={220} />
            <TarotMeaning lang={lang} card={card} orientation={phase.data.card.orientation} />
          </div>
        ) : null}
        <p className="small subtle">{t.dailyBrowser}</p>
      </div>
    </PatternCard>
    {card ? <AppInvite lang={lang} tool="tarot" /> : null}
    </div>
  );
}

// ── One or three cards ─────────────────────────────────────

interface StoredDraw { question: string; data: TarotDrawResponse }
const isDrawData = (count: 1 | 3) => (d: unknown): d is TarotDrawResponse =>
  typeof d === 'object' && d !== null && (d as TarotDrawResponse).reading?.cards?.length === count;
const MAX_QUESTION = 200;

export function TarotDraw({ lang, count }: { lang: Locale; count: 1 | 3 }) {
  const a = app(lang).tarotReading;
  const t = site(lang).tarot;
  const texts = useCardTexts();
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase<StoredDraw>>({ kind: 'idle' });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // A completed reading survives a refresh, for up to 30 days.
    const stored = readDraw(count, isDrawData(count));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setPhase({ kind: 'done', data: { question: stored.question, data: stored.data } });
    setChecked(true);
  }, [count]);

  async function draw() {
    const q = question.replace(/\s+/g, ' ').trim().slice(0, MAX_QUESTION);
    setPhase({ kind: 'loading' });
    const result = await drawCards(count);
    if (!result.ok) return setPhase({ kind: 'error', error: result.error });
    const stored: StoredDraw = { question: q, data: result.data };
    saveDraw(count, q, result.data);
    setPhase({ kind: 'done', data: stored });
  }

  function startOver() {
    clearDraw(count);
    setQuestion('');
    setPhase({ kind: 'idle' });
  }

  if (!checked) return <div className="card"><Loading lang={lang} /></div>;

  if (phase.kind === 'done') {
    const { data, question: q } = phase.data;
    const d = dates(lang);
    const cards = texts ? data.reading.cards.map((c) => ({ pick: c, view: texts(c.key, lang) })) : null;
    return (
      <div className="stack-lg" aria-live="polite">
        <PatternCard tint="violet">
          <div className="stack" style={{ gap: 6 }}>
            <p className="small subtle">{a.three.yourQuestion}</p>
            <p className="heading">{q || a.three.noQuestion}</p>
            <p className="small subtle">{fmt(t.drawnAt, { when: d.dateTime(data.drawnAt) })} · {t.keptNote}</p>
          </div>
        </PatternCard>
        {!cards ? <Loading lang={lang} lines={4} /> : count === 1 ? (
          <div className="card tarot-result">
            <TarotFace cardKey={cards[0].pick.key} name={cards[0].view?.text.name ?? ''} orientation={cards[0].pick.orientation} priority width={220} />
            {cards[0].view ? <TarotMeaning lang={lang} card={cards[0].view} orientation={cards[0].pick.orientation} /> : null}
          </div>
        ) : (
          <div className="tarot-spread">
            {cards.map(({ pick, view }) => (
              <article key={pick.key} className="card stack">
                <p className="eyebrow">{pick.position === 'card' ? '' : a.three.positions[pick.position]}</p>
                <TarotFace cardKey={pick.key} name={view?.text.name ?? ''} orientation={pick.orientation} priority width={200} />
                {view ? <TarotMeaning lang={lang} card={view} orientation={pick.orientation} heading="h3" /> : null}
              </article>
            ))}
          </div>
        )}
        <div className="row">
          <button type="button" className="btn btn-secondary" onClick={startOver}>{t.drawAgain}</button>
        </div>
        <TarotCredit lang={lang} />
        <AppInvite lang={lang} tool="tarot" />
      </div>
    );
  }

  return (
    <PatternCard tint="violet">
      <form className="stack" onSubmit={(e) => { e.preventDefault(); void draw(); }}>
        <div className="field">
          <label htmlFor={`q${count}`}>{t.questionLabel}</label>
          <textarea
            id={`q${count}`}
            className="input"
            maxLength={MAX_QUESTION}
            placeholder={a.three.questionPlaceholder}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            aria-describedby={`q${count}-hint`}
          />
          <p id={`q${count}-hint`} className="small subtle">{t.questionHint}</p>
        </div>
        {phase.kind === 'error' ? <ErrorState lang={lang} kind={phase.error.kind} /> : null}
        <div>
          <button type="submit" className="btn btn-primary" disabled={phase.kind === 'loading'}>
            {phase.kind === 'loading' ? site(lang).states.loading : count === 1 ? t.drawOne : t.drawThree}
          </button>
        </div>
      </form>
    </PatternCard>
  );
}
