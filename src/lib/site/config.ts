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
  '/about',
] as const;

/** Document pages under /{lang}/…, with text in src/content/legal/{slug}.{lang}.md. */
export const DOC_PAGES = ['about', 'privacy', 'terms', 'safety', 'delete-account'] as const;
export type DocPage = (typeof DOC_PAGES)[number];

/**
 * Drafts awaiting legal review (owner decision 18 Oct 2026: published with a
 * visible draft banner). They are noindex and stay out of the sitemap until
 * the reviewed texts replace them; remove a page from this list then.
 */
export const DRAFT_DOCS: readonly DocPage[] = ['privacy', 'terms', 'safety', 'delete-account'];
