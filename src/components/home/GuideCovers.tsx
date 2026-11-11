'use client';
/**
 * Home "Readings made from your own birth details" (owner, 11 Nov 2026): the six painted app covers
 * assemble as you scroll (pinned on wide screens, a staggered reveal on phones), then the Download
 * button. This section is also the target of every "get the app" link (#download).
 * Reduced motion: no motion; the covers are simply shown.
 */
import { useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { DownloadSimple } from '@phosphor-icons/react';
import type { Locale } from '@/i18n/config';
import type { SiteMessages } from '@/i18n/site/en';
import { COVER_THEMES, coverFile, coverSrcSet } from '@/lib/site/homeTools';
import { APP_DOWNLOAD_URL, appDownloadHref } from '@/lib/site/appLink';
import StoreBadges from '@/components/site/StoreBadges';
import './guide-covers.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const COVERS = ['natal', 'dreamspell', 'tarot', 'horoscope', 'numbers', 'moon'] as const;
/** Each cover opens its free reading on this site; Natal chart and Dreamspell are in the app only. */
const PAGE: Record<(typeof COVERS)[number], string | null> = { natal: null, dreamspell: null, tarot: '/tarot', horoscope: '/horoscope', numbers: '/numbers', moon: '/moon' };
const SIZES = '(min-width: 1100px) 360px, (min-width: 700px) 45vw, 90vw';

type Props = { lang: Locale; t: SiteMessages['appV2']; downloadLabel: string };

export default function GuideCovers({ lang, t, downloadLabel }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const { wide, motion } = ctx.conditions as { wide: boolean; motion: boolean };
      if (!motion) return;
      const covers = gsap.utils.toArray<HTMLElement>('.gc-cover');
      if (wide) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.gc-stage', start: 'top top', end: '+=120%', scrub: 0.8, pin: true } });
        covers.forEach((el, n) => {
          const col = n % 3; const row = Math.floor(n / 3);
          tl.fromTo(el, { opacity: 0, x: (col - 1) * 260, y: 220 + row * 80, rotate: (col - 1) * 9, scale: 0.82 },
            { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, ease: 'power2.out', duration: 1 }, n * 0.12);
        });
        tl.fromTo('.gc-text', { opacity: 0.35 }, { opacity: 1, duration: 0.6 }, 0);
      } else {
        covers.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
        });
      }
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <section ref={root} id="download" className="gc" aria-labelledby="guide-title">
      {/* Old links to the removed "Explore free readings" (#tools) land here too. */}
      <span id="tools" className="gc-anchor" aria-hidden="true" />
      <div className="gc-stage">
        <div className="gc-wrap gc-grid">
          <div className="gc-text">
            <p className="eyebrow">{t.guideEyebrow}</p>
            <h2 id="guide-title" className="gc-title">{t.guideTitle}</h2>
            <p className="lead">{t.guideBody}</p>
            <div className="gc-get">
              {APP_DOWNLOAD_URL ? (
                <a href={APP_DOWNLOAD_URL} className="btn btn-primary btn-3d" download>
                  <DownloadSimple weight="bold" aria-hidden /> {downloadLabel}
                </a>
              ) : (
                <StoreBadges lang={lang} />
              )}
              <p className="small muted">{t.adults}</p>
            </div>
          </div>
          <div className="gc-covers">
            {COVERS.map((name) => (
              <Link key={name} href={PAGE[name] ? `/${lang}${PAGE[name]}` : appDownloadHref(lang)} className="gc-cover" aria-label={t.covers[name]}>
                {COVER_THEMES.map((theme) => (
                  <picture key={theme} className={`gc-cover-${theme}`}>
                    <source type="image/avif" srcSet={coverSrcSet(name, theme, 'avif')} sizes={SIZES} />
                    { }
                    <img src={coverFile(name, theme, 600, 'webp')} srcSet={coverSrcSet(name, theme, 'webp')} sizes={SIZES} alt="" width={1200} height={600} loading="lazy" decoding="async" />
                  </picture>
                ))}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
