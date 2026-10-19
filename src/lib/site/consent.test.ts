import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  CONSENT_KEY,
  CONSENT_TTL_MS,
  cookieDomains,
  cookiesToClearOnLoad,
  expireGoogleCookies,
  isGoogleAnalyticsCookie,
  readConsent,
  safeUrl,
  saveConsent,
  type ConsentStore,
} from './consent.ts';

function memory(): ConsentStore & { data: Map<string, string> } {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v), removeItem: (k) => void data.delete(k) };
}

test('no stored choice means no consent', () => {
  assert.equal(readConsent(memory()), null);
});

test('a saved choice is read back until it expires', () => {
  const s = memory();
  const t0 = 1_800_000_000_000;
  assert.equal(saveConsent(s, 'granted', t0), true);
  assert.equal(readConsent(s, t0 + 1000), 'granted');
  saveConsent(s, 'denied', t0);
  assert.equal(readConsent(s, t0 + CONSENT_TTL_MS - 1), 'denied');
  assert.equal(readConsent(s, t0 + CONSENT_TTL_MS), null);
  assert.equal(s.data.has(CONSENT_KEY), false, 'expired record removed');
});

test('invalid records are ignored and removed', () => {
  for (const raw of ['x', 'null', '{"v":1,"choice":"yes","at":1}', '{"v":2,"choice":"granted","at":1}', '{"v":1,"choice":"granted"}']) {
    const s = memory();
    s.data.set(CONSENT_KEY, raw);
    assert.equal(readConsent(s, 1000), null, raw);
  }
});

test('blocked storage: nothing is read and saving reports failure', () => {
  const blocked: ConsentStore = {
    getItem: () => { throw new Error('blocked'); },
    setItem: () => { throw new Error('blocked'); },
    removeItem: () => { throw new Error('blocked'); },
  };
  assert.equal(readConsent(blocked), null);
  assert.equal(saveConsent(blocked, 'granted'), false);
});

test('reported URLs carry no query, fragment or quiz code', () => {
  assert.equal(safeUrl('https://www.soulmates.quest/quiz/AbC123?lang=bg#x'), 'https://www.soulmates.quest/quiz/[code]');
  assert.equal(safeUrl('https://www.soulmates.quest/quiz/answer/delete?t=secret'), 'https://www.soulmates.quest/quiz/answer/delete');
  assert.equal(safeUrl('https://www.soulmates.quest/en/tarot'), 'https://www.soulmates.quest/en/tarot');
});

test('Google Analytics cookies and their domains', () => {
  for (const n of ['_ga', '_ga_KJK7PCFVSC', '_gid', '_gat_gtag_x']) assert.ok(isGoogleAnalyticsCookie(n), n);
  for (const n of ['_gauge', 'ga', 'session']) assert.ok(!isGoogleAnalyticsCookie(n), n);
  assert.deepEqual(cookieDomains('www.soulmates.quest'), ['www.soulmates.quest', 'soulmates.quest']);
  assert.deepEqual(cookieDomains('localhost'), ['localhost']);
});

test('legacy Google cookies are cleared on load unless the choice is "granted"', () => {
  const header = '_ga=GA1.1.1.1; theme=x; _ga_KJK7PCFVSC=GS1.1; _gid=GA1.2; _gat_gtag_UA_1=1';
  const expected = ['_ga', '_ga_KJK7PCFVSC', '_gid', '_gat_gtag_UA_1'].flatMap((n) => [
    `${n}=; Max-Age=0; path=/`,
    `${n}=; Max-Age=0; path=/; domain=www.soulmates.quest`,
    `${n}=; Max-Age=0; path=/; domain=soulmates.quest`,
  ]);
  assert.deepEqual(cookiesToClearOnLoad(null, header, 'www.soulmates.quest'), expected);
  assert.deepEqual(cookiesToClearOnLoad('denied', header, 'www.soulmates.quest'), expected);
  assert.deepEqual(cookiesToClearOnLoad('granted', header, 'www.soulmates.quest'), []);
  assert.deepEqual(cookiesToClearOnLoad(null, 'theme=x', 'www.soulmates.quest'), []);
  assert.deepEqual(cookiesToClearOnLoad(null, '', 'localhost'), []);
  assert.ok(!expireGoogleCookies(header, 'localhost').some((c) => c.startsWith('theme=')), 'other cookies untouched');
});
