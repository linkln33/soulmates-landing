'use client';
/**
 * The /app page (owner, 11 Nov 2026): wide, image-led, animated with GSAP.
 *
 *  1. Hero: the HyperFrames loop (video/app-hero → public/app-content/video) behind the owner's headline.
 *  2. Your free guide: the six painted covers from the app assemble as you scroll (pinned on wide
 *     screens, a simple staggered reveal on phones).
 *  3. The Soulmate Quest: the path lights up step by step; an orb cycles example kinds of connection
 *     (captioned as kinds people hope to find, never a person or a score).
 *  4. Privacy band, 5. Download (status stays honest until the launch is decided).
 *
 * Reduced motion: no GSAP motion at all, the poster instead of the video, labels change without movement.
 */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import type { Locale } from '@/i18n/config';
import type { SiteMessages } from '@/i18n/site/en';
import { COVER_THEMES, coverFile, coverSrcSet } from '@/lib/site/homeTools';
import StoreBadges from '@/components/site/StoreBadges';
import './app-landing.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type T = SiteMessages['appV2'];
const COVERS = ['natal', 'dreamspell', 'tarot', 'horoscope', 'numbers', 'moon'] as const;
const REDUCED = '(prefers-reduced-motion: reduce)';
const subscribeReduced = (on: () => void) => { const mq = window.matchMedia(REDUCED); mq.addEventListener('change', on); return () => mq.removeEventListener('change', on); };
const readReduced = () => window.matchMedia(REDUCED).matches;
const COVER_SIZES = '(min-width: 1100px) 360px, (min-width: 700px) 45vw, 90vw';

function Cover({ name, label }: { name: (typeof COVERS)[number]; label: string }) {
  return (
    <figure className="al-cover" data-cover={name}>
      {COVER_THEMES.map((theme) => (
        <picture key={theme} className={`al-cover-${theme}`}>
          <source type="image/avif" srcSet={coverSrcSet(name, theme, 'avif')} sizes={COVER_SIZES} />
          { }
          <img src={coverFile(name, theme, 600, 'webp')} srcSet={coverSrcSet(name, theme, 'webp')} sizes={COVER_SIZES} alt="" width={1200} height={600} loading="lazy" decoding="async" />
        </picture>
      ))}
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}

function KindsOrb({ kinds, caption, reduced }: { kinds: readonly string[]; caption: string; reduced: boolean }) {
  const [i, setI] = useState(0);
  const label = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const timer = setInterval(() => {
      if (reduced || !label.current) { setI((n) => (n + 1) % kinds.length); return; }
      gsap.to(label.current, { opacity: 0, y: -6, duration: 0.3, onComplete: () => {
        setI((n) => (n + 1) % kinds.length);
        gsap.fromTo(label.current, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.45 });
      } });
    }, 2600);
    return () => clearInterval(timer);
  }, [kinds.length, reduced]);
  return (
    <div className="al-orb-wrap" aria-hidden="true">
      <div className="al-orb"><span className="al-orb-ring" /><span className="al-orb-core">♥</span></div>
      <span ref={label} className="al-orb-label">{kinds[i]}</span>
      <span className="al-orb-caption">{caption}</span>
    </div>
  );
}

export default function AppLanding({ lang, t }: { lang: Locale; t: T }) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(subscribeReduced, readReduced, () => false);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add({ wide: '(min-width: 900px)', narrow: '(max-width: 899px)', motion: '(prefers-reduced-motion: no-preference)' }, (ctx) => {
      const { wide, motion } = ctx.conditions as { wide: boolean; narrow: boolean; motion: boolean };
      if (!motion) return;
      // 1. Hero text arrives in steps.
      gsap.fromTo('.al-hero [data-in]', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.15 });
      // 2. Covers: pinned assembly on wide screens; a staggered reveal on phones.
      const covers = gsap.utils.toArray<HTMLElement>('.al-cover');
      if (wide) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: '.al-guide', start: 'top top', end: '+=120%', scrub: 0.8, pin: true } });
        covers.forEach((el, n) => {
          const col = n % 3; const row = Math.floor(n / 3);
          tl.fromTo(el, { opacity: 0, x: (col - 1) * 260, y: 220 + row * 80, rotate: (col - 1) * 9, scale: 0.82 },
            { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1, ease: 'power2.out', duration: 1 }, n * 0.12);
        });
        tl.fromTo('.al-guide-text', { opacity: 0.35 }, { opacity: 1, duration: 0.6 }, 0);
      } else {
        covers.forEach((el) => {
          gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
        });
      }
      // 3. The Quest path lights up as it scrolls into view.
      gsap.fromTo('.al-path-line', wide ? { scaleX: 0 } : { scaleY: 0 }, { ...(wide ? { scaleX: 1 } : { scaleY: 1 }), ease: 'none', scrollTrigger: { trigger: '.al-quest', start: 'top 70%', end: 'center 45%', scrub: 0.6 } });
      gsap.fromTo('.al-step', { opacity: 0.25, y: 12 }, { opacity: 1, y: 0, stagger: 0.18, ease: 'power2.out', scrollTrigger: { trigger: '.al-quest', start: 'top 70%', end: 'center 45%', scrub: 0.6 } });
      // 4–5. Soft reveals.
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
      });
    });
    return () => mm.revert();
  }, { scope: root });

  return (
    <div ref={root} className="al">
      <section className="al-hero">
        {reduced ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="al-hero-media" src="/app-content/video/app-hero-poster.jpg" alt="" />
        ) : (
          <video className="al-hero-media" autoPlay muted loop playsInline preload="metadata" poster="/app-content/video/app-hero-poster.jpg" aria-hidden="true">
            {/* Wide screens get the sharp 1080p loop; phones the light 720p one. */}
            <source src="/app-content/video/app-hero-1080.webm" type="video/webm" media="(min-width: 900px)" />
            <source src="/app-content/video/app-hero-1080.mp4" type="video/mp4" media="(min-width: 900px)" />
            <source src="/app-content/video/app-hero-720.webm" type="video/webm" />
            <source src="/app-content/video/app-hero-720.mp4" type="video/mp4" />
          </video>
        )}
        <div className="al-hero-shade" />
        <div className="al-wrap al-hero-inner">
          <p className="al-eyebrow" data-in>{t.eyebrow}</p>
          <h1 className="al-display" data-in>{t.title}</h1>
          <p className="al-lead" data-in>{t.lead}</p>
          <div className="al-ctas" data-in>
            <Link href={`/${lang}#tools`} className="btn btn-primary btn-3d">{t.ctaReadings}</Link>
            <a href="#quest" className="btn btn-glass al-btn-onDark">{t.ctaQuest}</a>
          </div>
          <p className="al-status" data-in><span className="al-dot" />{t.status}</p>
        </div>
      </section>

      <section className="al-guide">
        <div className="al-wrap al-guide-grid">
          <div className="al-guide-text">
            <p className="eyebrow">{t.guideEyebrow}</p>
            <h2 className="al-title">{t.guideTitle}</h2>
            <p className="lead">{t.guideBody}</p>
          </div>
          <div className="al-covers">
            {COVERS.map((c) => <Cover key={c} name={c} label={t.covers[c]} />)}
          </div>
        </div>
      </section>

      <section className="al-quest" id="quest">
        <div className="al-wrap al-quest-grid">
          <div>
            <p className="eyebrow">{t.questEyebrow}</p>
            <h2 className="al-title">{t.questTitle}</h2>
            <p className="lead">{t.questBody}</p>
            <ol className="al-path" aria-label={t.questTitle}>
              <span className="al-path-line" aria-hidden="true" />
              {t.path.map((step, n) => (
                <li key={step} className="al-step"><span className="al-step-dot">{n + 1}</span><span>{step}</span></li>
              ))}
            </ol>
          </div>
          <KindsOrb kinds={t.kinds} caption={t.kindsCaption} reduced={reduced} />
        </div>
      </section>

      <section className="al-privacy" data-reveal>
        <div className="al-wrap al-privacy-inner">
          <h2 className="al-title">{t.privacyTitle}</h2>
          <p className="lead">{t.privacyBody}</p>
        </div>
      </section>

      <section className="al-download" data-reveal>
        <div className="al-wrap al-download-inner">
          <h2 className="al-title">{t.downloadTitle}</h2>
          <p className="lead">{t.downloadBody}</p>
          <StoreBadges lang={lang} />
          <p className="small muted">{t.adults}</p>
        </div>
      </section>
    </div>
  );
}
