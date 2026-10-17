/**
 * Synced app content: every synced file still matches the manifest written by
 * scripts/sync-app-content.mjs (so a hand-edited copy fails), the deck is
 * complete, and every key the website uses has text in every language.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..', '..');
const read = (rel: string) => readFileSync(join(ROOT, rel));
const json = (rel: string) => JSON.parse(read(rel).toString('utf8'));
const manifest = json('src/content/app/manifest.json');

test('every synced file matches the sync manifest', () => {
  const outputs = Object.entries(manifest.outputs as Record<string, string>);
  assert.ok(outputs.length > 90);
  for (const [rel, sha] of outputs) {
    assert.ok(existsSync(join(ROOT, rel)), `missing ${rel}`);
    assert.equal(createHash('sha256').update(read(rel)).digest('hex'), sha, `${rel} was changed by hand; run npm run sync:app`);
  }
});

test('no unlisted files in the synced folders', () => {
  const listed = new Set(Object.keys(manifest.outputs));
  for (const dir of ['public/app-content/tarot', 'public/app-content/illustrations']) {
    for (const f of readdirSync(join(ROOT, dir))) assert.ok(listed.has(`${dir}/${f}`), `unlisted ${dir}/${f}`);
  }
});

test('the deck has all 78 cards, each with an image and EN/BG text', () => {
  const cards = json('src/content/app/tarotCards.json');
  const keys = Object.keys(cards);
  assert.equal(keys.length, 78);
  assert.equal(new Set(keys.map((k) => cards[k].index)).size, 78);
  for (const key of keys) {
    assert.ok(existsSync(join(ROOT, `public/app-content/tarot/${key}.webp`)), `image for ${key}`);
    for (const lang of ['en', 'bg']) {
      for (const field of ['name', 'upright', 'reversed', 'love', 'work', 'advice', 'imagery']) {
        assert.ok(cards[key][lang][field], `${key}.${lang}.${field}`);
      }
    }
  }
});

test('reading texts exist in both languages for every sign, phase and number', () => {
  const signs = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
  const phases = ['new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full_moon', 'waning_gibbous', 'last_quarter', 'waning_crescent'];
  for (const lang of ['en', 'bg']) {
    const m = json(`src/content/app/messages.${lang}.json`);
    for (const s of signs) {
      assert.ok(m.signs[s] && m.signIn[s] && m.signInto[s] && m.moon.mood[s]?.title, `${lang} sign ${s}`);
    }
    for (const p of phases) assert.ok(m.moon.phases[p], `${lang} phase ${p}`);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]) assert.ok(m.numbersReading.lifePath[`n${n}`]?.body, `${lang} life path ${n}`);
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9]) assert.ok(m.numbersReading.day[`d${n}`]?.body, `${lang} day ${n}`);
    for (const p of ['today', 'tomorrow', 'week', 'month']) assert.ok(m.horoscope.periods[p], `${lang} period ${p}`);
  }
  const texts = json('src/content/app/horoscopeTexts.json');
  for (let house = 1; house <= 12; house += 1) {
    for (const lang of ['en', 'bg']) assert.ok(texts.daily.moonHouse[house][lang], `daily.moonHouse.${house}.${lang}`);
  }
});

test('patterns are plain currentColor artwork', () => {
  const patterns = json('src/content/app/patterns.json');
  for (const [name, p] of Object.entries(patterns as Record<string, { viewBox: string; body: string }>)) {
    assert.match(p.viewBox, /^[\d.\s-]+$/, name);
    assert.doesNotMatch(p.body, /<script|on[a-z]+=|href=/i, name);
  }
});
