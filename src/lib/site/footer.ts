/**
 * Footer links (owner's list, 18 Oct 2026): About, Free readings, The app,
 * Privacy, Terms, Safety and reporting, Delete your account, Contact.
 * Every href is a real route or a mailto link; never "#".
 */
import type { Locale } from '../../i18n/config.ts';
import { CONTACT_EMAIL } from './config.ts';

export const FOOTER_KEYS = ['about', 'readings', 'app', 'privacy', 'terms', 'safety', 'deleteAccount', 'contact'] as const;
export type FooterKey = (typeof FOOTER_KEYS)[number];

export function footerLinks(lang: Locale): { key: FooterKey; href: string }[] {
  const hrefs: Record<FooterKey, string> = {
    about: `/${lang}/about`,
    readings: `/${lang}#tools`,
    app: `/${lang}/app`,
    privacy: `/${lang}/privacy`,
    terms: `/${lang}/terms`,
    safety: `/${lang}/safety`,
    deleteAccount: `/${lang}/delete-account`,
    contact: `mailto:${CONTACT_EMAIL}`,
  };
  return FOOTER_KEYS.map((key) => ({ key, href: hrefs[key] }));
}
