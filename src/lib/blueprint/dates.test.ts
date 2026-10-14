import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DATE_ERRORS,
  addDays,
  isoDateInTimeZone,
  localIsoDate,
  parseCalendarDate,
  serverLatestAllowedDate,
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

test('rejects future dates', () => {
  assert.deepEqual(validateBirthDate('2026-10-15', TODAY), { ok: false, error: DATE_ERRORS.future });
  assert.deepEqual(validateBirthDate('2999-01-01', TODAY), { ok: false, error: DATE_ERRORS.future });
});

test('parseCalendarDate round-trips', () => {
  assert.deepEqual(parseCalendarDate('2024-02-29'), { year: 2024, month: 2, day: 29, iso: '2024-02-29' });
  assert.equal(parseCalendarDate('2023-02-29'), null);
});

test('server leniency: Sofia today + 1 day', () => {
  // 2026-10-14 21:30 UTC is already 2026-10-15 00:30 in Sofia (UTC+3, EEST).
  const now = new Date(Date.UTC(2026, 9, 14, 21, 30));
  assert.equal(isoDateInTimeZone(now, 'Europe/Sofia'), '2026-10-15');
  assert.equal(serverLatestAllowedDate(now), '2026-10-16');
  // Earlier the same UTC day it is still the 14th in Sofia.
  assert.equal(serverLatestAllowedDate(new Date(Date.UTC(2026, 9, 14, 12))), '2026-10-15');
});

test('addDays crosses month and year boundaries', () => {
  assert.equal(addDays('2024-02-28', 1), '2024-02-29');
  assert.equal(addDays('2023-02-28', 1), '2023-03-01');
  assert.equal(addDays('2026-12-31', 1), '2027-01-01');
});

test('localIsoDate uses local calendar fields, zero-padded', () => {
  assert.equal(localIsoDate(new Date(2026, 0, 5, 23, 59)), '2026-01-05');
});
