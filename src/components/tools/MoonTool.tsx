'use client';

/**
 * Moon calendar (public /moon-calendar): the Moon now, a 30-day calendar of
 * main phases and sign changes, and the full list, in the visitor's zone.
 * MoonNow is the compact card for the home page.
 */
import Link from 'next/link';
import { useMemo } from 'react';
import type { Locale } from '@/i18n/config';
import { app, dates, fmt, site } from '@/i18n';
import { fetchMoonCalendar, visitorZone, type MoonCalendarResponse, type MoonEvent, type MoonState } from '@/lib/readings/api';
import { localDay } from '@/lib/readings/local';
import { useApi } from '@/lib/readings/useApi';
import { AppInvite, ErrorState, Loading } from '@/components/site/Bits';
import PatternCard from '@/components/site/PatternCard';
import MoonDisc from './MoonDisc';

const PHASE_SYMBOL: Record<string, string> = { new_moon: '●', first_quarter: '◐', full_moon: '○', last_quarter: '◑' };

function MoonFacts({ lang, moon, tz }: { lang: Locale; moon: MoonState; tz: string }) {
  const a = app(lang);
  const t = site(lang).moon;
  const d = dates(lang, tz);
  const mood = a.moon.mood[moon.sign];
  return (
    <div className="moon-now">
      <MoonDisc phase={moon.phase} illumination={moon.illumination} />
      <div className="stack" style={{ gap: 8 }}>
        <p className="title">{fmt(a.moon.phaseIn, { phase: a.moon.phases[moon.phase], in: a.signIn[moon.sign] })}</p>
        <p className="muted">{fmt(a.moon.illumination, { percent: Math.round(moon.illumination * 100) })}</p>
        <ul className="small muted" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <li>{fmt(t.entered, { sign: a.signs[moon.sign], when: d.dateTime(moon.enteredAt) })}</li>
          {moon.leavesAt ? <li>{fmt(t.leaves, { into: a.signInto[moon.nextSign], when: d.dateTime(moon.leavesAt) })}</li> : null}
          <li>{fmt(t.nextPhase, { phase: a.moon.phases[moon.nextPhase.phase], when: d.dateTime(moon.nextPhase.at) })}</li>
        </ul>
        <div style={{ marginTop: 6 }}>
          <p className="heading">{mood.title}</p>
          <p className="small muted">{mood.body}</p>
        </div>
      </div>
    </div>
  );
}

const load = () => fetchMoonCalendar(visitorZone(), 30);

export function MoonNow({ lang }: { lang: Locale }) {
  const t = site(lang);
  const { state, retry } = useApi(() => fetchMoonCalendar(visitorZone(), 1), []);
  return (
    <PatternCard tint="violet" aria-label={t.home.moonTitle}>
      <div className="stack">
        <h3 className="heading">{t.home.moonTitle}</h3>
        {state.status === 'loading' ? <Loading lang={lang} /> : null}
        {state.status === 'error' ? <ErrorState lang={lang} kind={state.error.kind} onRetry={retry} /> : null}
        {state.status === 'ok' ? <MoonFacts lang={lang} moon={state.data.moon} tz={state.data.timezone} /> : null}
        <div><Link href={`/${lang}/moon`} className="btn btn-secondary">{t.home.moonMore}</Link></div>
      </div>
    </PatternCard>
  );
}

interface CalendarDay { ymd: string; day: number; events: MoonEvent[] }

/** Days from the visitor's today, each with the events that fall on it in their zone. */
function calendarDays(data: MoonCalendarResponse): CalendarDay[] {
  const tz = data.timezone;
  const start = localDay(tz, new Date(data.from));
  const [y, m, d] = start.split('-').map(Number);
  const days: CalendarDay[] = [];
  for (let i = 0; i < data.days; i += 1) {
    const date = new Date(Date.UTC(y, m - 1, d + i));
    days.push({ ymd: date.toISOString().slice(0, 10), day: date.getUTCDate(), events: [] });
  }
  const byDay = new Map(days.map((x) => [x.ymd, x]));
  for (const event of data.events) byDay.get(localDay(tz, new Date(event.at)))?.events.push(event);
  return days;
}

function weekdayNames(lang: Locale): string[] {
  // 2001-01-01 was a Monday.
  return Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(lang === 'bg' ? 'bg-BG' : 'en-GB', { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2001, 0, 1 + i))));
}

function MoonCalendarView({ lang, data }: { lang: Locale; data: MoonCalendarResponse }) {
  const a = app(lang);
  const t = site(lang).moon;
  const d = dates(lang, data.timezone);
  const days = useMemo(() => calendarDays(data), [data]);
  const first = days[0];
  const lead = first ? (new Date(`${first.ymd}T12:00:00Z`).getUTCDay() + 6) % 7 : 0;
  const names = weekdayNames(lang);
  return (
    <>
      <section className="card stack" aria-labelledby="moon-cal-title">
        <h2 id="moon-cal-title" className="heading">{t.calendarTitle}</h2>
        {/* Visual overview; the same events are listed in full below for screen readers. */}
        <div className="moon-cal" aria-hidden="true">
          {names.map((n) => <div key={n} className="dow">{n}</div>)}
          {Array.from({ length: lead }, (_, i) => <div key={`e${i}`} className="moon-day empty" />)}
          {days.map((day, i) => (
            <div key={day.ymd} className={`moon-day${i === 0 ? ' today' : ''}`} title={d.calendar(day.ymd)}>
              <span className="d">{day.day}</span>
              {day.events.map((e) => (
                <span key={e.at} className={`ev${e.type === 'phase' ? ' ph' : ''}`}>
                  {e.type === 'phase'
                    ? <><span>{PHASE_SYMBOL[e.phase] ?? '◌'}</span><span className="t">{a.moon.phases[e.phase]}</span></>
                    : <><span>→</span><span className="t">{a.signs[e.sign]}</span></>}
                </span>
              ))}
            </div>
          ))}
        </div>
        <p className="small muted">{fmt(a.moonCalendar.timesIn, { zone: data.timezone })}</p>
      </section>
      <section className="card stack" aria-labelledby="moon-list-title">
        <h2 id="moon-list-title" className="heading">{t.listTitle}</h2>
        <ul className="event-list">
          {data.events.map((e) => (
            <li key={e.at}>
              <span className="muted">{d.dateTime(e.at)}</span>
              <span>
                {e.type === 'phase'
                  ? <strong>{a.moon.phases[e.phase]}</strong>
                  : fmt(a.moonCalendar.enters, { into: a.signInto[e.sign] })}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default function MoonTool({ lang }: { lang: Locale }) {
  const t = site(lang).moon;
  const { state, retry } = useApi(load, []);
  return (
    <div className="stack-lg">
      <PatternCard tint="violet" aria-label={t.nowTitle}>
        <div className="stack">
          <h2 className="heading">{t.nowTitle}</h2>
          {state.status === 'loading' ? <Loading lang={lang} lines={4} /> : null}
          {state.status === 'error' ? <ErrorState lang={lang} kind={state.error.kind} onRetry={retry} /> : null}
          {state.status === 'ok' ? <MoonFacts lang={lang} moon={state.data.moon} tz={state.data.timezone} /> : null}
        </div>
      </PatternCard>
      {state.status === 'ok' ? <><MoonCalendarView lang={lang} data={state.data} /><AppInvite lang={lang} tool="moon" /></> : null}
    </div>
  );
}
