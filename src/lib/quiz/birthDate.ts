/**
 * Optional birth date on the quiz: three inputs (day / month / year) turned
 * into YYYY-MM-DD. Same rules as the free reading: a real calendar date from
 * 1900-01-01 up to today in Europe/Sofia (the date the server checks against).
 */
import { MIN_BIRTH_YEAR, parseCalendarDate } from './dates.ts';

export type BirthDateParts = { day: string; month: string; year: string };

export type BirthDateCheck =
  | { ok: true; iso: string | null }
  | { ok: false; error: 'incomplete' | 'invalid' | 'range' };

export function checkBirthDate(parts: BirthDateParts, today: string): BirthDateCheck {
  const day = parts.day.trim();
  const month = parts.month.trim();
  const year = parts.year.trim();
  if (!day && !month && !year) return { ok: true, iso: null };
  if (!day || !month || !year) return { ok: false, error: 'incomplete' };
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year)) return { ok: false, error: 'invalid' };
  const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const date = parseCalendarDate(iso);
  if (!date) return { ok: false, error: 'invalid' };
  if (date.year < MIN_BIRTH_YEAR || iso > today) return { ok: false, error: 'range' };
  return { ok: true, iso };
}
