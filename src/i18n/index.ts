/**
 * Text lookup for the portal. Two sources:
 *  - site(lang): the website's own text (src/i18n/site/*).
 *  - app(lang):  the app's reading texts, synced unchanged from the app
 *                (src/content/app/messages.*.json; see scripts/sync-app-content.mjs).
 * Placeholders use the app's {name} style; fmt() fills them.
 */
import type { Locale } from './config';
import { LOCALE_INFO } from './config';
import siteEn, { type SiteMessages } from './site/en';
import siteBg from './site/bg';
import appEn from '@/content/app/messages.en.json';
import appBg from '@/content/app/messages.bg.json';

export type AppMessages = typeof appEn;

const SITE: Record<Locale, SiteMessages> = { en: siteEn, bg: siteBg };
const APP: Record<Locale, AppMessages> = { en: appEn, bg: appBg as AppMessages };

export function site(lang: Locale): SiteMessages {
  return SITE[lang];
}

export function app(lang: Locale): AppMessages {
  return APP[lang];
}

/** Fill {placeholders}. Unknown placeholders are left as they are. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/** Value at a dotted path in the app messages, e.g. 'signs.libra'. */
export function appText(lang: Locale, path: string): string {
  let node: unknown = APP[lang];
  for (const segment of path.split('.')) {
    if (!node || typeof node !== 'object') return path;
    node = (node as Record<string, unknown>)[segment];
  }
  return typeof node === 'string' ? node : path;
}

function safeFormat(lang: Locale, options: Intl.DateTimeFormatOptions, date: Date, timeZone?: string): string {
  try {
    return new Intl.DateTimeFormat(LOCALE_INFO[lang].intl, { ...options, timeZone }).format(date);
  } catch {
    return new Intl.DateTimeFormat(LOCALE_INFO[lang].intl, options).format(date);
  }
}

/** Date formats shared with the app (lib/i18n formatDateTime / formatDate / formatCalendarDate). */
export function dates(lang: Locale, timeZone?: string) {
  return {
    dateTime: (iso: string | Date) =>
      safeFormat(lang, { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }, new Date(iso), timeZone),
    date: (iso: string | Date) => safeFormat(lang, { day: 'numeric', month: 'long' }, new Date(iso), timeZone),
    weekday: (iso: string | Date) => safeFormat(lang, { weekday: 'short' }, new Date(iso), timeZone),
    time: (iso: string | Date) => safeFormat(lang, { hour: '2-digit', minute: '2-digit' }, new Date(iso), timeZone),
    /** A month and day as a calendar date, never shifted by time zone (sign date ranges). */
    dayMonth: ([month, day]: readonly [number, number] | number[]) =>
      safeFormat(lang, { day: 'numeric', month: 'long' }, new Date(Date.UTC(2001, month - 1, day, 12)), 'UTC'),
    /** 'YYYY-MM-DD' as "12 October 2026", never shifted by time zone. */
    calendar: (ymd: string) => {
      const [y, m, d] = ymd.split('-').map(Number);
      return safeFormat(lang, { day: 'numeric', month: 'long', year: 'numeric' }, new Date(Date.UTC(y, m - 1, d)), 'UTC');
    },
  };
}
