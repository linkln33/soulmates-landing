/**
 * Numerology for the free reading.
 *
 * LETTER CONVENTION (also documented in ./README.md)
 *
 * 1. Each character of the name is lower-cased and looked at in NFC form.
 *    - If it is one of the 30 letters of the Bulgarian alphabet it is scored
 *      with the Bulgarian table (checked first, so "й" is never reduced to "и").
 *    - Otherwise it is decomposed to NFD and its combining marks are stripped.
 *      If what remains is a single Latin letter a-z (é -> e, ë -> e, ñ -> n),
 *      it is scored with the Latin table.
 *    - Everything else (digits, spaces, hyphens, apostrophes, CJK, Greek,
 *      Russian/Ukrainian-only letters such as ё ы э і ї є ґ, Bulgarian ѝ,
 *      and Latin letters that do not decompose to a-z such as ß ø æ ł) is
 *      ignored.
 * 2. Latin table: standard Pythagorean, a=1 ... i=9, j=1 ... r=9, s=1 ... z=8.
 * 3. Bulgarian table -- OUR CHOSEN CONVENTION, not a universal standard:
 *    each letter's position in the 30-letter Bulgarian alphabet
 *    (а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ь ю я),
 *    reduced on the same 1-9 cycle: value = ((position - 1) mod 9) + 1.
 *    Other Cyrillic conventions exist (e.g. tables built for the 33-letter
 *    Russian alphabet, or transliterating to Latin first and using the
 *    Pythagorean table). They give different numbers for the same name, so
 *    the UI shows a footnote naming this as our convention.
 * 4. Mixed-script names are allowed; each letter uses its own script's table.
 * 5. Vowels (soul urge): Latin a e i o u y (y is always counted as a vowel,
 *    as in the previous implementation); Bulgarian а е и о у ъ ю я.
 *
 * REDUCTION RULE (one rule, used everywhere)
 *   reduce(n): while n > 9 and n is not 11, 22 or 33, replace n by the sum of
 *   its digits. Master numbers are therefore kept whenever a reduction step
 *   lands on them (29 -> 11 stays 11; 66 -> 12 -> 3).
 *
 * Expression = reduce(sum of all letter values).
 * Soul urge  = reduce(sum of vowel values).
 * If no letter (or, for soul urge, no vowel) is countable, the result is
 * null. There is never a fallback "1".
 *
 * Life path = reduce(reduce(month) + reduce(day) + reduce(digit sum of year)),
 * i.e. the "reduce month, day and year separately keeping master numbers, add
 * them, reduce again keeping master numbers" method.
 */

export const MASTER_NUMBERS = [11, 22, 33] as const;

export function digitSum(n: number): number {
  return String(n)
    .split('')
    .reduce((s, d) => s + Number(d), 0);
}

export function reduceNumber(n: number): number {
  if (!Number.isInteger(n) || n < 0) throw new RangeError(`Cannot reduce ${n}`);
  let v = n;
  while (v > 9 && v !== 11 && v !== 22 && v !== 33) v = digitSum(v);
  return v;
}

const LATIN = 'abcdefghijklmnopqrstuvwxyz';
export const BULGARIAN_ALPHABET = 'абвгдежзийклмнопрстуфхцчшщъьюя';

const LATIN_VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
const BULGARIAN_VOWELS = new Set(['а', 'е', 'и', 'о', 'у', 'ъ', 'ю', 'я']);

export interface ScoredLetter {
  letter: string;
  script: 'latin' | 'bulgarian';
  value: number;
  vowel: boolean;
}

function cycleValue(position: number): number {
  return ((position - 1) % 9) + 1;
}

/** Score a single character, or return null if the convention ignores it. */
export function scoreChar(ch: string): ScoredLetter | null {
  const lower = ch.normalize('NFC').toLowerCase();
  const bgIndex = BULGARIAN_ALPHABET.indexOf(lower);
  if (lower.length === 1 && bgIndex !== -1) {
    return { letter: lower, script: 'bulgarian', value: cycleValue(bgIndex + 1), vowel: BULGARIAN_VOWELS.has(lower) };
  }
  const base = lower.normalize('NFD').replace(/\p{M}+/gu, '');
  if (base.length === 1) {
    const latinIndex = LATIN.indexOf(base);
    if (latinIndex !== -1) {
      return { letter: base, script: 'latin', value: cycleValue(latinIndex + 1), vowel: LATIN_VOWELS.has(base) };
    }
  }
  return null;
}

/** Score every countable letter of a name, in order. */
export function scoreName(name: string): ScoredLetter[] {
  const out: ScoredLetter[] = [];
  // Iterate NFC grapheme-ish units: code points of the NFC string.
  for (const ch of Array.from(name.normalize('NFC'))) {
    const s = scoreChar(ch);
    if (s) out.push(s);
  }
  return out;
}

export function calcExpression(name: string): number | null {
  const letters = scoreName(name);
  if (letters.length === 0) return null;
  return reduceNumber(letters.reduce((s, l) => s + l.value, 0));
}

export function calcSoulUrge(name: string): number | null {
  const vowels = scoreName(name).filter((l) => l.vowel);
  if (vowels.length === 0) return null;
  return reduceNumber(vowels.reduce((s, l) => s + l.value, 0));
}

export function calcLifePath(year: number, month: number, day: number): number {
  return reduceNumber(reduceNumber(month) + reduceNumber(day) + reduceNumber(digitSum(year)));
}

const LIFE_PATH_INSIGHTS: Record<number, string> = {
  1: 'Traditional numerology pairs Life Path 1 with someone independent and inspiring, who respects your lead while holding their own ground. Classic pairings: 3, 5 or 7.',
  2: 'Traditional numerology pairs Life Path 2 with someone gentle yet perceptive, a natural peacemaker. Classic pairings: 6, 8 or 9.',
  3: 'Traditional numerology pairs Life Path 3 with someone who values creativity and self-expression as much as you do. Classic pairings: 1, 5 or 7.',
  4: 'Traditional numerology pairs Life Path 4 with someone who values stability, patience and loyalty. Classic pairings: 2, 6 or 8.',
  5: 'Traditional numerology pairs Life Path 5 with someone who enjoys freedom and adventure. Classic pairings: 1, 3 or 7.',
  6: 'Traditional numerology pairs Life Path 6 with someone warm and responsible, who makes a home wherever they are. Classic pairings: 2, 4 or 9.',
  7: 'Traditional numerology pairs Life Path 7 with a fellow seeker: introspective and drawn to deeper questions. Classic pairings: 1, 3 or 5.',
  8: 'Traditional numerology pairs Life Path 8 with someone driven and purposeful. Classic pairings: 2, 4 or 6.',
  9: 'Traditional numerology pairs Life Path 9 with someone compassionate and idealistic. Classic pairings: 2, 3 or 6.',
  11: 'Life Path 11 is a master number. Tradition pairs it with someone intuitive who shares your interest in inner life. Classic pairings: 2, 6 or another 11.',
  22: 'Life Path 22 is a master number. Tradition pairs it with someone who dreams big and has the discipline to build. Classic pairings: 4, 6 or 11.',
  33: 'Life Path 33 is a master number. Tradition pairs it with someone empathic and devoted to growth. Classic pairings: 6, 9 or 11.',
};

const COMPATIBLE_LIFE_PATHS: Record<number, number[]> = {
  1: [3, 5, 7], 2: [6, 8, 9], 3: [1, 5, 7], 4: [2, 6, 8],
  5: [1, 3, 7], 6: [2, 4, 9], 7: [1, 3, 5], 8: [2, 4, 6],
  9: [2, 6, 3], 11: [2, 6, 11], 22: [4, 6, 11], 33: [6, 9, 11],
};

export function getLifePathInsight(lp: number): string {
  const text = LIFE_PATH_INSIGHTS[lp];
  if (!text) throw new RangeError(`No insight for life path ${lp}`);
  return text;
}

export function getCompatibleLifePaths(lp: number): number[] {
  const list = COMPATIBLE_LIFE_PATHS[lp];
  if (!list) throw new RangeError(`No pairings for life path ${lp}`);
  return list;
}
