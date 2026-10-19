/**
 * Home "Explore free readings" tiles. A tile with `cover` shows that painting
 * (the owner's artwork from the app's assets/cards, encoded by
 * scripts/make-covers.mjs into public/app-content/covers/); a tile without one
 * shows its app illustration on the tile tint until a painting exists.
 *
 * Adding a painting (e.g. Numbers or Moon) is two steps:
 *   1. Put <name>-light.jpg and <name>-dark.jpg (2:1, e.g. 1400x700) in
 *      SoulMates-Quest-mobile/assets/cards/, then run
 *      node scripts/make-covers.mjs numbers=<name>   (or moon=<name>)
 *      which writes public/app-content/covers/numbers-{light,dark}-{600,1200}.{avif,webp}.
 *   2. Set `cover: 'numbers'` on that tile below.
 */
export const COVER_WIDTHS = [600, 1200] as const;
export const COVER_THEMES = ['light', 'dark'] as const;
export const COVER_FORMATS = ['avif', 'webp'] as const;

export type CoverTheme = (typeof COVER_THEMES)[number];
export type CoverFormat = (typeof COVER_FORMATS)[number];

export interface HomeTool {
  key: 'horoscope' | 'tarot' | 'numbers' | 'moon';
  href: string;
  /** App illustration (public/app-content/illustrations/<art>.svg), shown when there is no cover. */
  art: string;
  /** Tile tint token (--tile-<tile>) behind the illustration. */
  tile: string;
  /** Painted cover name in public/app-content/covers/, or null. */
  cover: string | null;
}

export const HOME_TOOLS: readonly HomeTool[] = [
  { key: 'horoscope', href: '/horoscope', art: 'horoscope-wheel', tile: 'horoscope', cover: 'horoscope' },
  { key: 'tarot', href: '/tarot', art: 'tarot', tile: 'tarot', cover: 'tarot' },
  { key: 'numbers', href: '/numbers', art: 'numbers', tile: 'numbers', cover: null },
  { key: 'moon', href: '/moon', art: 'moon-phases', tile: 'moon-calendar', cover: null },
];

export const coverFile = (cover: string, theme: CoverTheme, width: number, format: CoverFormat) =>
  `/app-content/covers/${cover}-${theme}-${width}.${format}`;

export const coverSrcSet = (cover: string, theme: CoverTheme, format: CoverFormat) =>
  COVER_WIDTHS.map((w) => `${coverFile(cover, theme, w, format)} ${w}w`).join(', ');

/** Rendered tile width: 1 column below 600 px, 2 up to 999 px, 4 above (home .wrap is 1320 px). */
export const COVER_SIZES = '(min-width: 1360px) 250px, (min-width: 1000px) 25vw, (min-width: 600px) 50vw, calc(100vw - 32px)';
