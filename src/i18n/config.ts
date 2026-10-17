/**
 * Website languages. Adding a language means: add its code here, a site
 * dictionary in src/i18n/site/, and the app's messages for it (synced from
 * the app by scripts/sync-app-content.mjs). Pages, metadata alternates and
 * the sitemap all read this list.
 */
export const LOCALES = ['en', 'bg'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const LOCALE_INFO: Record<Locale, { label: string; short: string; intl: string; og: string }> = {
  en: { label: 'English', short: 'EN', intl: 'en-GB', og: 'en_GB' },
  bg: { label: 'Български', short: 'БГ', intl: 'bg-BG', og: 'bg_BG' },
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/** Best supported language from an Accept-Language header. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;
  const ranked = header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const q = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      return { base: tag.trim().toLowerCase().split('-')[0], q: q ? Number(q.slice(2)) || 0 : 1 };
    })
    .filter((x) => x.base && x.q > 0)
    .sort((a, b) => b.q - a.q);
  return ranked.map((x) => x.base).find(isLocale) ?? DEFAULT_LOCALE;
}
