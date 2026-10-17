/**
 * Written horoscope texts for the server's solar-house placements
 * (solar-houses-v1), synced from the app; same lookup as the app's
 * lib/readings/content/horoscope.ts.
 */
import type { Locale } from '@/i18n/config';
import HOROSCOPE_TEXTS from '@/content/app/horoscopeTexts.json';
import type { SignKey } from './signs';


export type PeriodKey = 'today' | 'tomorrow' | 'week' | 'month';
export const PERIODS: PeriodKey[] = ['today', 'tomorrow', 'week', 'month'];

export type PhaseKey =
  | 'new_moon' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous'
  | 'full_moon' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export interface HoroscopePart {
  key: string;
  body?: 'sun' | 'moon' | 'mercury' | 'venus' | 'mars';
  sign?: SignKey;
  house?: number;
  phase?: PhaseKey;
  at?: string;
}

type Leaf = { en: string; bg: string };
type LabelKey = keyof typeof HOROSCOPE_TEXTS.labels;

function lookup(path: string): Leaf | null {
  let node: unknown = HOROSCOPE_TEXTS;
  for (const segment of path.split('.')) {
    if (!node || typeof node !== 'object') return null;
    node = (node as Record<string, unknown>)[segment];
  }
  return node && typeof node === 'object' && 'en' in (node as object) ? (node as Leaf) : null;
}

export function horoscopeLabel(key: LabelKey, lang: Locale): string {
  const leaf = HOROSCOPE_TEXTS.labels[key] as Leaf;
  return leaf[lang] ?? leaf.en;
}

/** Heading per placement group (same table as the app). */
const HEADINGS: Record<string, LabelKey> = {
  'daily.moonHouse': 'moonFocus',
  'daily.phase': 'phaseNote',
  'weekly.sun': 'sunSpotlight',
  'weekly.mercury': 'talks',
  'weekly.venus': 'love',
  'weekly.mars': 'drive',
  'weekly.mercuryRetrograde': 'talks',
  'monthly.sun': 'sunSpotlight',
  'monthly.newMoon': 'newMoon',
  'monthly.fullMoon': 'fullMoon',
};

export interface HoroscopeSection {
  heading: string;
  part: HoroscopePart;
  body: string;
}

/** Every placement that has text, in server order. */
export function horoscopeSections(parts: HoroscopePart[], lang: Locale): HoroscopeSection[] {
  const sections: HoroscopeSection[] = [];
  for (const part of parts) {
    const leaf = lookup(part.key);
    const group = part.key.split('.').slice(0, 2).join('.');
    const heading = HEADINGS[group];
    if (leaf && heading) sections.push({ heading: horoscopeLabel(heading, lang), part, body: leaf[lang] ?? leaf.en });
  }
  return sections;
}

