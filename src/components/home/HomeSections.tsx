/**
 * Homepage section after the free readings: the app journey in three stages,
 * which is also the limited-pilot section. It shows how the experience is
 * meant to feel and labels what is available today. Matching mechanics,
 * compatibility details and scores stay off the site until the backend and
 * mobile release ships them (SoulMates-Quest-mobile/docs/MATCHES_MODEL.md).
 */
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import JourneyTimeline, { type JourneyAccent, type JourneyStage } from '@/components/home/JourneyTimeline';

/** Journey artwork (sources and encoder: assets/source/journey, encode-journey.mjs). */
const JOURNEY_ART: { key: string; accent: JourneyAccent; base: string; width: number; height: number }[] = [
  { key: 'inner-world', accent: 'pink', base: '/home/journey/inner-world', width: 960, height: 1024 },
  { key: 'notice-connection', accent: 'teal', base: '/home/journey/notice-connection', width: 960, height: 621 },
  { key: 'explore-together', accent: 'green', base: '/home/journey/explore-together', width: 960, height: 644 },
];
const JOURNEY_WIDTHS = [480, 720, 960] as const;

export function JourneySection({ lang }: { lang: Locale }) {
  const t = site(lang).home;
  const j = t.journey;
  const stages: JourneyStage[] = j.stages.map((s, i) => ({
    key: JOURNEY_ART[i].key,
    step: String(i + 1).padStart(2, '0'),
    title: s.title,
    body: s.body,
    statuses: s.statuses,
    accent: JOURNEY_ART[i].accent,
    art: { base: JOURNEY_ART[i].base, widths: JOURNEY_WIDTHS, width: JOURNEY_ART[i].width, height: JOURNEY_ART[i].height, alt: s.alt },
  }));
  return (
    <section className="h-section h-tinted h-journey" aria-labelledby="journey-title">
      <div className="wrap stack-lg">
        <div className="h-head">
          <p className="eyebrow">{j.eyebrow}</p>
          <h2 id="journey-title" className="h-title">{j.title}</h2>
          <p className="lead">{j.lead}</p>
        </div>
        <JourneyTimeline stages={stages} label={j.label} />
        <div className="journey-closing">
          <p className="journey-closing-title">
            <span>{j.closingTop}</span> <span className="h-accent">{j.closingAccent}</span>
          </p>
          <p className="lead">{j.closingLead}</p>
          <Link href={`/${lang}/app`} className="btn btn-glass btn-3d">
            {t.ctaApp} <ArrowRight weight="bold" aria-hidden />
          </Link>
          <p className="small muted">{j.consent}</p>
          <p className="small muted">{j.note}</p>
        </div>
      </div>
    </section>
  );
}
