/**
 * Western tropical sun sign from month and day, using fixed cut-off dates
 * (the same table the landing page has always used; the exact ingress day
 * can vary by a day from year to year, which this table does not model).
 *
 * Out-of-range input (month outside 1-12, or a day that does not exist in
 * that month; 29 February is allowed) returns null instead of falling
 * through to a default sign.
 */

export type SunSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type Element = 'Fire' | 'Earth' | 'Air' | 'Water';
export type Modality = 'Cardinal' | 'Fixed' | 'Mutable';

/** Maximum day per month, allowing 29 February. */
const MAX_DAY = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** [sign, first month, first day] — each sign runs until the next one starts. */
const STARTS: [SunSign, number, number][] = [
  ['Capricorn', 1, 1], // continues from 22 December
  ['Aquarius', 1, 20],
  ['Pisces', 2, 19],
  ['Aries', 3, 21],
  ['Taurus', 4, 20],
  ['Gemini', 5, 21],
  ['Cancer', 6, 21],
  ['Leo', 7, 23],
  ['Virgo', 8, 23],
  ['Libra', 9, 23],
  ['Scorpio', 10, 23],
  ['Sagittarius', 11, 22],
  ['Capricorn', 12, 22],
];

export function getSunSign(month: number, day: number): SunSign | null {
  if (!Number.isInteger(month) || !Number.isInteger(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > MAX_DAY[month - 1]) return null;
  let sign: SunSign | null = null;
  for (const [s, m, d] of STARTS) {
    if (month > m || (month === m && day >= d)) sign = s;
  }
  return sign;
}

const ELEMENT: Record<SunSign, Element> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};

const MODALITY: Record<SunSign, Modality> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable',
};

const COMPATIBLE: Record<SunSign, SunSign[]> = {
  Aries: ['Leo', 'Sagittarius', 'Gemini', 'Aquarius'],
  Taurus: ['Virgo', 'Capricorn', 'Cancer', 'Pisces'],
  Gemini: ['Libra', 'Aquarius', 'Aries', 'Leo'],
  Cancer: ['Scorpio', 'Pisces', 'Taurus', 'Virgo'],
  Leo: ['Aries', 'Sagittarius', 'Gemini', 'Libra'],
  Virgo: ['Taurus', 'Capricorn', 'Cancer', 'Scorpio'],
  Libra: ['Gemini', 'Aquarius', 'Leo', 'Sagittarius'],
  Scorpio: ['Cancer', 'Pisces', 'Virgo', 'Capricorn'],
  Sagittarius: ['Aries', 'Leo', 'Libra', 'Aquarius'],
  Capricorn: ['Taurus', 'Virgo', 'Scorpio', 'Pisces'],
  Aquarius: ['Gemini', 'Libra', 'Aries', 'Sagittarius'],
  Pisces: ['Cancer', 'Scorpio', 'Taurus', 'Capricorn'],
};

const COMPLEMENTARY: Record<Element, Element> = { Fire: 'Air', Air: 'Fire', Earth: 'Water', Water: 'Earth' };

const ATTRACTION: Record<Element, string> = {
  Fire: 'someone who brings ideas and intellectual spark',
  Air: 'someone whose warmth and passion turn ideas into action',
  Earth: 'someone whose emotional depth complements your steadiness',
  Water: 'someone whose stability and patience make room for your feelings',
};

export const getElement = (s: SunSign): Element => ELEMENT[s];
export const getModality = (s: SunSign): Modality => MODALITY[s];
export const getCompatibleSigns = (s: SunSign): SunSign[] => COMPATIBLE[s];
export const getComplementaryElement = (e: Element): Element => COMPLEMENTARY[e];
export const getElementAttraction = (e: Element): string => ATTRACTION[e];
