import type { MetadataRoute } from 'next';
import { LOCALES, LOCALE_INFO, DEFAULT_LOCALE } from '@/i18n/config';
import { PORTAL_PATHS, SITE_URL } from '@/lib/site/config';
import { SIGN_KEYS } from '@/content/signs';
import { TAROT_KEYS, cardSlug } from '@/content/tarot';

/**
 * Every localised portal page, with its language alternates. Not listed:
 * draft legal pages, quiz links (private), deletion links and anything with
 * a personal result (results only exist in the visitor's browser).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number; changeFrequency: 'daily' | 'monthly' }[] = [
    ...PORTAL_PATHS.map((path) => ({ path, priority: path === '' ? 1 : 0.8, changeFrequency: 'monthly' as const })),
    ...SIGN_KEYS.map((sign) => ({ path: `/horoscope/${sign}`, priority: 0.8, changeFrequency: 'daily' as const })),
    ...TAROT_KEYS.map((key) => ({ path: `/tarot/cards/${cardSlug(key)}`, priority: 0.5, changeFrequency: 'monthly' as const })),
  ];
  return paths.flatMap(({ path, priority, changeFrequency }) =>
    LOCALES.map((lang) => ({
      url: `${SITE_URL}/${lang}${path}`,
      changeFrequency,
      priority,
      alternates: {
        languages: {
          ...Object.fromEntries(LOCALES.map((l) => [LOCALE_INFO[l].intl, `${SITE_URL}/${l}${path}`])),
          'x-default': `${SITE_URL}/${DEFAULT_LOCALE}${path}`,
        },
      },
    })),
  );
}
