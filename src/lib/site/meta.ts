/**
 * Page metadata for localised portal pages: one canonical URL per language,
 * hreflang alternates for every language plus x-default, and Open Graph.
 */
import type { Metadata } from 'next';
import { DEFAULT_LOCALE, LOCALES, LOCALE_INFO, type Locale } from '@/i18n/config';
import { site } from '@/i18n';

/** `/en/tarot` for lang 'en' and path '/tarot' ('' is the language home). */
export const localePath = (lang: Locale, path: string) => `/${lang}${path}`;

export function alternates(lang: Locale, path: string): Metadata['alternates'] {
  return {
    canonical: localePath(lang, path),
    languages: {
      ...Object.fromEntries(LOCALES.map((l) => [LOCALE_INFO[l].intl, localePath(l, path)])),
      'x-default': localePath(DEFAULT_LOCALE, path),
    },
  };
}

export function pageMeta(lang: Locale, path: string, title: string, description: string, image?: string): Metadata {
  const t = site(lang);
  const images = [image ? { url: image } : { url: '/app-content/logo.png', width: 1373, height: 655 }];
  return {
    title,
    description,
    alternates: alternates(lang, path),
    openGraph: {
      title,
      description,
      url: localePath(lang, path),
      siteName: t.siteName,
      locale: LOCALE_INFO[lang].og,
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => LOCALE_INFO[l].og),
      type: 'website',
      images,
    },
    twitter: { card: image ? 'summary_large_image' : 'summary', title, description, images: images.map((i) => i.url) },
  };
}
