import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
import { cleanFirstName, normalizeReferralCode, referralDeepLink, validateReferralCode } from './referral.ts';
import en from '../../i18n/site/en.ts';
import bg from '../../i18n/site/bg.ts';

const API = 'https://api.example.test/api';

function answer(status: number, body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return { status, ok: status >= 200 && status < 300, json: async () => body };
  };
  return { calls, fetchImpl };
}

test('codes are trimmed, lowercased and checked against the contract format', () => {
  assert.equal(normalizeReferralCode('  AbCd2345 '), 'abcd2345');
  assert.equal(normalizeReferralCode('ivan-7k3m9p'), 'ivan-7k3m9p');
  assert.equal(normalizeReferralCode('IVAN-7K3M9P'), 'ivan-7k3m9p');
  assert.equal(normalizeReferralCode('a'.repeat(32)), 'a'.repeat(32));
  assert.equal(normalizeReferralCode('abc'), null);
  assert.equal(normalizeReferralCode('a'.repeat(33)), null);
  assert.equal(normalizeReferralCode('ab_cd'), null);
  assert.equal(normalizeReferralCode('abcd%2Fx'), null);
  assert.equal(normalizeReferralCode('%E0%A4%A'), null);
  assert.equal(normalizeReferralCode('иван1234'), null);
  assert.equal(normalizeReferralCode(undefined), null);
});

test('the deep link uses the app scheme', () => {
  assert.equal(referralDeepLink('abcd2345'), 'soulmatesquest://r/abcd2345');
});

test('a malformed code is invalid without calling the API', async () => {
  const { calls, fetchImpl } = answer(200, { valid: true, referrer: { firstName: 'Ana' } });
  assert.deepEqual(await validateReferralCode('no', { apiBase: API, fetchImpl }), { status: 'invalid' });
  assert.equal(calls.length, 0);
});

test('a valid code posts the normalised code and returns the first name', async () => {
  const { calls, fetchImpl } = answer(200, { valid: true, referrer: { firstName: '  Maria ' } });
  assert.deepEqual(await validateReferralCode(' ABCD2345', { apiBase: `${API}/`, fetchImpl }), { status: 'valid', firstName: 'Maria' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, `${API}/referrals/validate`);
  assert.equal(calls[0].init.method, 'POST');
  assert.equal(calls[0].init.body, JSON.stringify({ code: 'abcd2345' }));
  assert.equal(calls[0].init.cache, 'no-store');
  assert.ok(calls[0].init.signal);
});

test('a valid code without a first name returns null', async () => {
  for (const referrer of [{ firstName: null }, {}, null, { firstName: '   ' }, { firstName: 42 }]) {
    const { fetchImpl } = answer(200, { valid: true, referrer });
    assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: API, fetchImpl }), { status: 'valid', firstName: null });
  }
});

test('404 and 400 are invalid', async () => {
  for (const status of [404, 400]) {
    const { fetchImpl } = answer(status, { error: 'invalid_code' });
    assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: API, fetchImpl }), { status: 'invalid' });
  }
});

test('rate limits, server errors, odd answers, network errors and a missing API are unavailable', async () => {
  for (const [status, body] of [[429, {}], [500, {}], [503, null], [200, { valid: false }], [200, null]] as const) {
    const { fetchImpl } = answer(status, body);
    assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: API, fetchImpl }), { status: 'unavailable' }, String(status));
  }
  const failing = async () => { throw new Error('offline'); };
  assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: API, fetchImpl: failing }), { status: 'unavailable' });
  assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: '' }), { status: 'unavailable' });
});

test('a slow API times out as unavailable', async () => {
  const hanging = (_url: string, init: RequestInit) =>
    new Promise<never>((_, reject) => init.signal?.addEventListener('abort', () => reject(new Error('aborted'))));
  assert.deepEqual(await validateReferralCode('abcd2345', { apiBase: API, fetchImpl: hanging, timeoutMs: 20 }), { status: 'unavailable' });
});

test('first names are trimmed and overly long values are dropped', () => {
  assert.equal(cleanFirstName(' Ana  Maria '), 'Ana Maria');
  assert.equal(cleanFirstName('x'.repeat(61)), null);
  assert.equal(cleanFirstName(''), null);
});

test('invitation texts carry no reward or earning language', () => {
  const words = /reward|commission|earn|money|cash|bonus|prize|\bpaid\b|награ|комисион|печел|пари|бонус/i;
  for (const dict of [en, bg]) {
    for (const value of Object.values(dict.referral)) assert.ok(!words.test(value), value);
  }
});

test('the referral module has no imports, so the browser bundle can use it', () => {
  const source = readFileSync(new URL('./referral.ts', import.meta.url), 'utf8');
  assert.ok(!/^\s*import\s/m.test(source));
  assert.ok(!/server-only|next\/headers/.test(source));
});
