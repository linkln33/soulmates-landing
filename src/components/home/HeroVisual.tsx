/**
 * Homepage hero composition: the owner-supplied transparent image of the app
 * Home with its floating cards and light trails, used whole (source:
 * SoulMates-Quest-mobile/assets/welcome/SoulMates Quest phone with floating
 * cards.png, kept in assets/source with its Bulgarian version; trimmed to
 * its visible edge and encoded to AVIF/WebP in public/home/). Each language
 * gets its own image, so /bg never shows an English interface. It is the hero's largest image, so it loads eagerly with
 * high priority; width and height reserve its space. Its scores are
 * illustrative, which the visible badge states.
 */
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';

const WIDTHS = [640, 960, 1280, 1516] as const;
const BASE: Record<Locale, string> = { en: '/home/hero-composition', bg: '/home/hero-composition-bg' };
const srcSet = (lang: Locale, ext: 'avif' | 'webp') => WIDTHS.map((w) => `${BASE[lang]}-${w}.${ext} ${w}w`).join(', ');
const SIZES = '(min-width: 1320px) 680px, (min-width: 1024px) 52vw, (min-width: 808px) 760px, calc(100vw - 32px)';

/** A concealed person: soft head-and-shoulders silhouette, blurred by CSS. */
export function Concealed({ hue, className = '' }: { hue: 'a' | 'b' | 'c' | 'd'; className?: string }) {
  return (
    <span className={`concealed concealed-${hue} ${className}`} aria-hidden>
      <svg viewBox="0 0 40 40" focusable="false">
        <circle cx="20" cy="15" r="8" />
        <path d="M5 40c1-9 7-14 15-14s14 5 15 14z" />
      </svg>
    </span>
  );
}

export default function HeroVisual({ lang }: { lang: Locale }) {
  const p = site(lang).home.preview;
  return (
    <figure className="hv">
      <picture>
        <source type="image/avif" srcSet={srcSet(lang, 'avif')} sizes={SIZES} />
        <img
          src={`${BASE[lang]}-960.webp`}
          srcSet={srcSet(lang, 'webp')}
          sizes={SIZES}
          width={1516}
          height={989}
          alt={p.label}
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <figcaption className="hv-badge">{p.badge}</figcaption>
    </figure>
  );
}
