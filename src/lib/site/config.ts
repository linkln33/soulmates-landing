/** Canonical host. The apex soulmates.quest redirects here. */
export const SITE_URL = 'https://www.soulmates.quest';

/** Contact address already published on the site before M0.1. */
export const CONTACT_EMAIL = 'hello@soulmates.quest';

/** The canonical production API (the only backend; no preview backends). */
export const CANONICAL_API_URL = 'https://soul-mates-backend.vercel.app/api';

/**
 * API base used by the browser, without a trailing slash. Configured
 * explicitly through NEXT_PUBLIC_API_URL (Vercel production environment;
 * .env.local for development); next.config.ts refuses to build without it,
 * and a production build only accepts CANONICAL_API_URL.
 */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/+$/, '');

/** Localised portal pages (without the /{lang} prefix) listed in the sitemap. */
export const PORTAL_PATHS = [
  '',
  '/horoscope',
  '/tarot',
  '/tarot/one-card',
  '/tarot/three-cards',
  '/tarot/cards',
  '/numbers',
  '/moon',
  '/app',
] as const;
