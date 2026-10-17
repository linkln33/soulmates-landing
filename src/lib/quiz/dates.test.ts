import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DATE_ERRORS,
  futureDateError,
  isoDateInTimeZone,
  parseCalendarDate,
  todayInSofia,
  validateBirthDate,
} from './dates.ts';

const TODAY = '2026-10-14';

test('accepts real dates including 29 Feb in a leap year', () => {
  for (const d of ['2024-02-29', '2000-02-29', '1990-01-01', '1900-01-01', '1995-12-31', TODAY]) {
    const r = validateBirthDate(d, TODAY);
    assert.equal(r.ok, true, d);
  }
});

test('rejects dates that do not exist', () => {
  for (const d of ['1995-02-31', '2023-02-29', '1900-02-29', '1990-13-01', '1990-00-00', '1990-04-31', '1990-01-32']) {
    assert.deepEqual(validateBirthDate(d, TODAY), { ok: false, error: DATE_ERRORS.notReal }, d);
  }
});

test('rejects bad formats and non-strings', () => {
  for (const d of ['1990-1-1', '01/02/1990', '19900101', '', 'abc', '1990-01-01T00:00:00Z', 19900101, null, undefined, {}]) {
    assert.deepEqual(validateBirthDate(d, TODAY), { ok: false, error: DATE_ERRORS.format }, String(d));
  }
});

test('rejects years before 1900', () => {
  assert.deepEqual(validateBirthDate('1899-12-31', TODAY), { ok: false, error: DATE_ERRORS.tooEarly });
  assert.deepEqual(validateBirthDate('0001-01-01', TODAY), { ok: false, error: DATE_ERRORS.tooEarly });
});

test('rejects any date after the latest allowed day (no leniency)', () => {
  // TODAY itself is accepted (see the first test); the very next day is not.
  assert.deepEqual(validateBirthDate('2026-10-15', TODAY), { ok: false, error: futureDateError(TODAY) });
  assert.deepEqual(validateBirthDate('2999-01-01', TODAY), { ok: false, error: futureDateError(TODAY) });
});

test('future-date message is clear and names the latest accepted date', () => {
  const msg = futureDateError('2026-10-14');
  assert.match(msg, /cannot be in the future/);
  assert.match(msg, /2026-10-14/);
  assert.match(msg, /Europe\/Sofia/);
});

test('parseCalendarDate round-trips', () => {
  assert.deepEqual(parseCalendarDate('2024-02-29'), { year: 2024, month: 2, day: 29, iso: '2024-02-29' });
  assert.equal(parseCalendarDate('2023-02-29'), null);
});

test('todayInSofia follows the Sofia calendar day, not UTC (injected clock)', () => {
  // Sofia is UTC+3 in summer time (EEST) and UTC+2 in winter (EET).
  // 2026-10-14 20:59 UTC = 23:59 EEST on the 14th in Sofia.
  assert.equal(todayInSofia(new Date(Date.UTC(2026, 9, 14, 20, 59))), '2026-10-14');
  // 2026-10-14 21:00 UTC = 00:00 EEST on the 15th in Sofia, still the 14th in UTC.
  assert.equal(todayInSofia(new Date(Date.UTC(2026, 9, 14, 21, 0))), '2026-10-15');
  // Winter: 2026-12-31 22:00 UTC = 00:00 EET on 2027-01-01 in Sofia.
  assert.equal(todayInSofia(new Date(Date.UTC(2026, 11, 31, 21, 59))), '2026-12-31');
  assert.equal(todayInSofia(new Date(Date.UTC(2026, 11, 31, 22, 0))), '2027-01-01');
  assert.equal(isoDateInTimeZone(new Date(Date.UTC(2026, 11, 31, 22, 0)), 'UTC'), '2026-12-31');
});

test('Sofia-today rule end to end: today accepted, tomorrow rejected', () => {
  const now = new Date(Date.UTC(2026, 9, 14, 21, 30)); // 00:30 on the 15th in Sofia
  const today = todayInSofia(now);
  assert.equal(validateBirthDate('2026-10-15', today).ok, true);
  assert.deepEqual(validateBirthDate('2026-10-16', today), { ok: false, error: futureDateError('2026-10-15') });
});
