import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkBirthDate } from './birthDate.ts';
import { MESSAGES, resolveLang } from './messages.ts';

const TODAY = '2026-10-16';
const parts = (day: string, month: string, year: string) => ({ day, month, year });

test('birth date: empty is allowed (optional)', () => {
  assert.deepEqual(checkBirthDate(parts('', ' ', ''), TODAY), { ok: true, iso: null });
});

test('birth date: real dates are padded to YYYY-MM-DD', () => {
  assert.deepEqual(checkBirthDate(parts('7', '3', '1994'), TODAY), { ok: true, iso: '1994-03-07' });
  assert.deepEqual(checkBirthDate(parts('29', '2', '2024'), TODAY), { ok: true, iso: '2024-02-29' });
  assert.deepEqual(checkBirthDate(parts('1', '1', '1900'), TODAY), { ok: true, iso: '1900-01-01' });
  assert.deepEqual(checkBirthDate(parts('16', '10', '2026'), TODAY), { ok: true, iso: TODAY });
});

test('birth date: incomplete, impossible and out-of-range dates are rejected', () => {
  assert.deepEqual(checkBirthDate(parts('7', '', '1994'), TODAY), { ok: false, error: 'incomplete' });
  assert.deepEqual(checkBirthDate(parts('31', '2', '1995'), TODAY), { ok: false, error: 'invalid' });
  assert.deepEqual(checkBirthDate(parts('29', '2', '2023'), TODAY), { ok: false, error: 'invalid' });
  assert.deepEqual(checkBirthDate(parts('1', '13', '1990'), TODAY), { ok: false, error: 'invalid' });
  assert.deepEqual(checkBirthDate(parts('1', '1', '94'), TODAY), { ok: false, error: 'invalid' });
  assert.deepEqual(checkBirthDate(parts('31', '12', '1899'), TODAY), { ok: false, error: 'range' });
  assert.deepEqual(checkBirthDate(parts('17', '10', '2026'), TODAY), { ok: false, error: 'range' });
});

test('language: ?lang wins, then Accept-Language ranking, else English', () => {
  assert.equal(resolveLang('bg', 'en-US,en;q=0.9'), 'bg');
  assert.equal(resolveLang('en', 'bg'), 'en');
  assert.equal(resolveLang(['bg'], null), 'bg');
  assert.equal(resolveLang('fr', 'bg-BG,bg;q=0.9,en;q=0.8'), 'bg');
  assert.equal(resolveLang(undefined, 'en-GB,en;q=0.9,bg;q=0.8'), 'en');
  assert.equal(resolveLang(undefined, 'de-DE,de;q=0.9,bg;q=0.5'), 'bg');
  assert.equal(resolveLang(undefined, 'en;q=0.5,bg;q=0.7'), 'bg');
  assert.equal(resolveLang(undefined, 'bg;q=0,en'), 'en');
  assert.equal(resolveLang(undefined, ''), 'en');
  assert.equal(resolveLang(undefined, null), 'en');
});

test('messages: both languages define every key', () => {
  assert.deepEqual(Object.keys(MESSAGES.bg).sort(), Object.keys(MESSAGES.en).sort());
  for (const [key, value] of Object.entries(MESSAGES.bg)) {
    assert.equal(typeof value, typeof MESSAGES.en[key as keyof typeof MESSAGES.en], key);
  }
});

test('retention months: from the API days, 12 as the fallback', async () => {
  const { retentionMonths } = await import('./messages.ts');
  assert.equal(retentionMonths(365), 12);
  assert.equal(retentionMonths(180), 6);
  assert.equal(retentionMonths(730), 24);
  assert.equal(retentionMonths(10), 1);
  assert.equal(retentionMonths(undefined), 12);
  assert.equal(retentionMonths('365'), 12);
  assert.equal(retentionMonths(0), 12);
});
