/**
 * Birth-date validation for the free reading.
 *
 * Rules (shared by the API route and the FreeTaste form):
 * - The value must be a string in the exact form YYYY-MM-DD.
 * - It must be a real calendar date: the year/month/day must round-trip
 *   through a UTC Date unchanged (so 1995-02-31, 2023-02-29, 1990-13-01 and
 *   1990-00-00 are rejected, while 2024-02-29 is accepted).
 * - The year must be 1900 or later.
 * - It must not be later than `latestAllowed` (a YYYY-MM-DD string chosen by
 *   the caller).
 *
 * Future-date policy: the server passes "today in Europe/Sofia plus one day"
 * (see `serverLatestAllowedDate`). The one-day leniency means a visitor in a
 * time zone ahead of Sofia (e.g. Asia/Tokyo just after midnight) who enters
 * their own local "today" is not rejected. The browser form passes the
 * visitor's local date, so it never offers a future date in the first place.
 */

export const MIN_BIRTH_YEAR = 1900;

export interface CalendarDate {
  year: number;
  month: number;
  day: number;
  /** Normalised YYYY-MM-DD string. */
  iso: string;
}

export type DateValidation =
  | { ok: true; date: CalendarDate }
  | { ok: false; error: string };

export const DATE_ERRORS = {
  format: 'Birth date must be a date in the format YYYY-MM-DD.',
  notReal: 'That date does not exist on the calendar. Please check the day and month.',
  tooEarly: `Please enter a birth year of ${MIN_BIRTH_YEAR} or later.`,
  future: 'Birth date cannot be in the future.',
} as const;

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Parse a YYYY-MM-DD string into a real calendar date, or null. */
export function parseCalendarDate(value: string): CalendarDate | null {
  const m = ISO_DATE.exec(value);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  const d = new Date(Date.UTC(year, month - 1, day));
  // Date.UTC maps years 0-99 to 1900-1999; setUTCFullYear avoids that quirk.
  d.setUTCFullYear(year);
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
    return null;
  }
  return { year, month, day, iso: value };
}

/** Number of days in a month, accounting for Gregorian leap years. */
export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

export function validateBirthDate(value: unknown, latestAllowed: string): DateValidation {
  if (typeof value !== 'string') return { ok: false, error: DATE_ERRORS.format };
  const trimmed = value.trim();
  if (!ISO_DATE.test(trimmed)) return { ok: false, error: DATE_ERRORS.format };
  const date = parseCalendarDate(trimmed);
  if (!date) return { ok: false, error: DATE_ERRORS.notReal };
  if (date.year < MIN_BIRTH_YEAR) return { ok: false, error: DATE_ERRORS.tooEarly };
  // Zero-padded ISO strings compare correctly as plain strings.
  if (date.iso > latestAllowed) return { ok: false, error: DATE_ERRORS.future };
  return { ok: true, date };
}

/** Format a date's local calendar fields in a given IANA time zone as YYYY-MM-DD. */
export function isoDateInTimeZone(now: Date, timeZone: string): string {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/** Add whole days to a YYYY-MM-DD string. */
export function addDays(iso: string, days: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return t.toISOString().slice(0, 10);
}

/** Latest birth date the server accepts: today in Europe/Sofia, plus one day of leniency. */
export function serverLatestAllowedDate(now: Date = new Date()): string {
  return addDays(isoDateInTimeZone(now, 'Europe/Sofia'), 1);
}

/** The visitor's local calendar date as YYYY-MM-DD (not UTC). */
export function localIsoDate(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
