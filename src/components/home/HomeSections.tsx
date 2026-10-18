/**
 * Homepage story sections after the free readings: concealed matches,
 * compatibility, connection exploration, privacy and controls. Everything
 * here describes the app, which is being prepared for a private pilot.
 * Scores are illustrative and labelled; the calculation stays private
 * (SoulMates-Quest-mobile/docs/MATCHES_MODEL.md).
 */
import type { CSSProperties } from 'react';
import {
  ChatCircleDots, EyeSlash, HandPointing, Heart, ListChecks, LockKey, Question, ShieldCheck, Sparkle, BookOpenText, SlidersHorizontal,
} from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { Concealed } from './HeroVisual';

function SectionHead({ id, eyebrow, title, lead }: { id: string; eyebrow?: string; title: string; lead: string }) {
  return (
    <div className="h-head">
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="h-title">{title}</h2>
      <p className="lead">{lead}</p>
    </div>
  );
}

/** Illustrative feed: hidden identities, status and example scores (one still pending). */
const FEED = [
  { hue: 'a', status: 'new', score: 91 },
  { hue: 'c', status: 'ready', score: 84 },
  { hue: 'b', status: 'waiting', score: 78 },
  { hue: 'd', status: 'new', score: null },
] as const;

export function MatchesSection({ lang }: { lang: Locale }) {
  const t = site(lang).home;
  return (
    <section className="h-section" aria-labelledby="matches-title">
      <div className="wrap h-split">
        <div className="stack-lg">
          <SectionHead id="matches-title" eyebrow={t.inApp} title={t.matchesTitle} lead={t.matchesLead} />
          <ul className="h-points">
            {t.matchesPoints.map((item, i) => {
              const Icon = [EyeSlash, Heart, Sparkle][i];
              return (
                <li key={item.title}>
                  <span className="h-icon h-icon-pink"><Icon weight="duotone" aria-hidden /></span>
                  <div><h3 className="heading">{item.title}</h3><p className="small muted">{item.body}</p></div>
                </li>
              );
            })}
          </ul>
          <p className="small subtle">{t.pilot}</p>
        </div>

        <figure className="h-feed" aria-labelledby="feed-caption">
          <div className="h-feed-head">
            <p className="heading">{t.feed.title}</p>
            <p className="small muted">{t.feed.intro}</p>
          </div>
          <ul className="h-feed-list">
            {FEED.map((m, i) => (
              <li key={i}>
                <Concealed hue={m.hue} className="feed" />
                <div className="h-feed-who">
                  <span className="h-feed-name">{t.feed.item}</span>
                  <span className={`h-status h-status-${m.status}`}>{t.feed.status[m.status]}</span>
                </div>
                {m.score === null ? (
                  <span className="h-score h-score-pending">{t.feed.pending}</span>
                ) : (
                  <span className="h-score">
                    <b><Heart weight="fill" aria-hidden />{m.score}%</b>
                    <small>{t.illustrative}</small>
                  </span>
                )}
              </li>
            ))}
          </ul>
          <figcaption id="feed-caption" className="caption subtle">{t.illustrativePreview}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/** Illustrative dimension values; Consciousness & Growth shows the "not enough information" state. */
const DIMENSIONS: (number | null)[] = [86, 79, 74, 88, 70, 82, null];
const DIM_COLORS = ['energy', 'communication', 'energy', 'focus', 'balance', 'connection', 'connection'];

export function CompatibilitySection({ lang }: { lang: Locale }) {
  const t = site(lang).home;
  return (
    <section className="h-section h-tinted" aria-labelledby="compat-title">
      <div className="wrap h-split h-split-rev">
        <div className="stack-lg">
          <SectionHead id="compat-title" eyebrow={t.inApp} title={t.compatTitle} lead={t.compatLead} />
          <p className="notice">{t.compatStatus}</p>
        </div>

        <figure className="h-compat" aria-labelledby="compat-caption">
          <div className="h-compat-head"><span className="h-chip">{t.illustrative}</span></div>
          <ul className="h-dims">
            {t.dimensions.map((d, i) => {
              const v = DIMENSIONS[i];
              return (
                <li key={d.name} style={{ '--meter-color': `var(--meter-${DIM_COLORS[i]})` } as CSSProperties}>
                  <span className="h-dim-name">{d.name}</span>
                  {v === null ? (
                    <span className="h-dim-none">{t.compatNotEnough}</span>
                  ) : (
                    <>
                      <span className="h-bar"><span style={{ width: `${v}%` }} /></span>
                      <span className="h-dim-v">{v}%</span>
                    </>
                  )}
                  <span className="h-dim-about">{d.about}</span>
                </li>
              );
            })}
          </ul>
          <figcaption id="compat-caption" className="caption subtle">{t.illustrativePreview}</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function ExploreSection({ lang }: { lang: Locale }) {
  const t = site(lang).home;
  const icons = [ChatCircleDots, Question, ListChecks, BookOpenText, Sparkle];
  return (
    <section className="h-section" aria-labelledby="explore-title">
      <div className="wrap">
        <SectionHead id="explore-title" eyebrow={t.inApp} title={t.exploreTitle} lead={t.exploreLead} />
        <ul className="h-grid h-grid-5">
          {t.explore.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="h-card">
                <span className={`h-icon ${i === 4 ? 'h-icon-pink' : 'h-icon-teal'}`}><Icon weight="duotone" aria-hidden /></span>
                <h3 className="heading">{item.title}</h3>
                <p className="small muted">{item.body}</p>
                {i > 0 ? <span className="h-soon">{t.preparing}</span> : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function PrivacySection({ lang }: { lang: Locale }) {
  const t = site(lang).home;
  const icons = [LockKey, HandPointing, SlidersHorizontal, ShieldCheck];
  return (
    <section className="h-section h-tinted" aria-labelledby="privacy-title">
      <div className="wrap">
        <SectionHead id="privacy-title" title={t.privacyTitle} lead={t.privacyLead} />
        <ul className="h-grid h-grid-4">
          {t.privacy.map((item, i) => {
            const Icon = icons[i];
            return (
              <li key={item.title} className="h-card">
                <span className="h-icon h-icon-teal"><Icon weight="duotone" aria-hidden /></span>
                <h3 className="heading">{item.title}</h3>
                <p className="small muted">{item.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
