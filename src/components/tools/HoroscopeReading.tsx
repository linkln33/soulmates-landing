'use client';

/**
 * Written horoscope for one sign (public /horoscope, solar-houses-v1).
 * The period lives in ?period= so a reading can be linked; the server picks
 * the placements, the synced app texts supply the words.
 */
import { useEffect, useState } from 'react';
import type { Locale } from '@/i18n/config';
import { app, dates, fmt, site } from '@/i18n';
import { PERIODS, horoscopeLabel, horoscopeSections, type PeriodKey } from '@/content/horoscope';
import type { SignKey } from '@/content/signs';
import { fetchHoroscope, visitorZone, type HoroscopeResponse, type IndicatorKey } from '@/lib/readings/api';
import { useApi } from '@/lib/readings/useApi';
import { AppInvite, ErrorState, Loading } from '@/components/site/Bits';
import PatternCard from '@/components/site/PatternCard';

const isPeriod = (v: unknown): v is PeriodKey => typeof v === 'string' && (PERIODS as string[]).includes(v);

function Meters({ lang, items }: { lang: Locale; items: { key: IndicatorKey; level: 1 | 2 | 3 | 4 }[] }) {
  const a = app(lang).indicators;
  return (
    <ul className="meters" style={{ listStyle: 'none' }}>
      {items.map((item) => (
        <li key={item.key} className="meter" style={{ ['--meter-color' as string]: `var(--meter-${item.key})` }}>
          <span className="muted">{a[item.key].name}</span>
          <span className="meter-track" aria-hidden>
            {[1, 2, 3, 4].map((n) => <span key={n} className={n <= item.level ? 'on' : ''} />)}
          </span>
          <span className="small" style={{ fontWeight: 600 }}>{a.level[item.level]}</span>
        </li>
      ))}
    </ul>
  );
}

function Reading({ lang, data }: { lang: Locale; data: HoroscopeResponse }) {
  const a = app(lang);
  const t = site(lang).horoscope;
  const d = dates(lang, data.timezone);
  const reading = data.reading.status === 'ok' ? data.reading : null;
  const sections = reading ? horoscopeSections(reading.parts, lang) : [];
  if (!reading || !sections.length) {
    return <div className="state"><p className="muted">{a.horoscope.textUnavailable}</p></div>;
  }
  const range = reading.range.from === reading.range.to
    ? d.calendar(reading.range.from)
    : fmt(a.horoscope.range, { from: d.calendar(reading.range.from), to: d.calendar(reading.range.to) });
  const moon = data.sky.moon;
  return (
    <div className="stack">
      <PatternCard tint="plain" motif="constellation">
        <div className="stack">
          <h2 className="title">{fmt(t.readingTitle, { period: a.horoscope.periods[data.period], range })}</h2>
          {data.indicators.status === 'ok' ? <Meters lang={lang} items={data.indicators.items} /> : null}
          <div>
            {sections.map((s) => (
              <section key={s.part.key} className="reading-section">
                <h3>{s.heading}</h3>
                {s.part.body && s.part.sign && s.part.house ? (
                  <p className="placement">
                    {fmt(a.horoscope.placement, { body: a.horoscope.bodies[s.part.body], sign: a.signs[s.part.sign], house: s.part.house })}
                  </p>
                ) : null}
                {s.part.at ? <p className="placement">{fmt(a.horoscope.on, { when: d.date(s.part.at) })}</p> : null}
                <p className="text">{s.body}</p>
              </section>
            ))}
          </div>
          {(reading.facts?.moonSignChanges ?? []).map((c) => (
            <p key={c.at} className="small muted">
              {fmt(a.horoscope.moonMoves, { when: d.dateTime(c.at), sign: a.signs[c.sign], house: c.house })}
            </p>
          ))}
          <p className="small subtle">{horoscopeLabel('method', lang)}</p>
          <p className="small subtle">{fmt(t.timezoneNote, { zone: data.timezone })}</p>
        </div>
      </PatternCard>
      <PatternCard tint="teal">
        <h2 className="heading">{fmt(a.horoscope.moonForSign, { sign: a.signs[data.sign] })}</h2>
        <p style={{ marginTop: 6 }}>{fmt(a.moon.phaseIn, { phase: a.moon.phases[moon.phase], in: a.signIn[moon.sign] })}</p>
        {moon.sign === data.sign && moon.leavesAt ? (
          <p className="small muted" style={{ marginTop: 4 }}>
            {fmt(a.horoscope.moonInSign, { in: a.signIn[data.sign] })}{' '}
            {fmt(a.moon.leavesAt, { into: a.signInto[moon.nextSign], when: d.dateTime(moon.leavesAt) })}
          </p>
        ) : null}
      </PatternCard>
    </div>
  );
}

export default function HoroscopeReading({ lang, sign }: { lang: Locale; sign: SignKey }) {
  const a = app(lang);
  const t = site(lang).horoscope;
  const [period, setPeriod] = useState<PeriodKey>('today');

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('period');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isPeriod(fromUrl)) setPeriod(fromUrl);
  }, []);

  function choose(next: PeriodKey) {
    setPeriod(next);
    const url = new URL(window.location.href);
    if (next === 'today') url.searchParams.delete('period');
    else url.searchParams.set('period', next);
    window.history.replaceState(window.history.state, '', url);
  }

  const { state, retry } = useApi(() => fetchHoroscope(sign, period, visitorZone()), [sign, period]);

  return (
    <div className="stack">
      <div className="chips" role="group" aria-label={t.periodsLabel}>
        {PERIODS.map((p) => (
          <button key={p} type="button" className="chip" aria-pressed={p === period} onClick={() => choose(p)}>
            {a.horoscope.periods[p]}
          </button>
        ))}
      </div>
      <div aria-live="polite">
        {state.status === 'loading' ? <div className="card"><Loading lang={lang} lines={6} /></div> : null}
        {state.status === 'error' ? <ErrorState lang={lang} kind={state.error.kind} onRetry={retry} /> : null}
        {state.status === 'ok' ? <Reading lang={lang} data={state.data} /> : null}
      </div>
      {state.status === 'ok' ? <AppInvite lang={lang} tool="horoscope" /> : null}
    </div>
  );
}
