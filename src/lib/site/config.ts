/** Canonical host. The apex soulmates.quest redirects here. */
export const SITE_URL = 'https://www.soulmates.quest';

/** Contact address already published on the site before M0.1. */
export const CONTACT_EMAIL = 'hello@soulmates.quest';

/** The one production API (no preview backends). Without a trailing slash. */
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'https://soul-mates-backend.vercel.app/api').replace(/\/+$/, '');

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
