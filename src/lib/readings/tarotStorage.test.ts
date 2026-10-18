import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  DRAW_TTL_MS,
  TAROT_KEYS,
  TAROT_SCHEMA,
  VISITOR_TTL_MS,
  clearDraw,
  localDay,
  nextLocalMidnight,
  readDaily,
  readDraw,
  readVisitor,
  saveDaily,
  saveDraw,
  sweepTarotStorage,
  takeVisitorId,
  type KeyValueStore,
} from './tarotStorage.ts';

const ID = '3f2a8c1e-4b5d-4e6f-8a9b-0c1d2e3f4a5b';
const OTHER = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';

class Mem implements KeyValueStore {
  map = new Map<string, string>();
  getItem(k: string) { return this.map.has(k) ? this.map.get(k)! : null; }
  setItem(k: string, v: string) { this.map.set(k, v); }
  removeItem(k: string) { this.map.delete(k); }
  json(k: string) { const v = this.map.get(k); return v === undefined ? undefined : JSON.parse(v); }
}

type Daily = { date: string; card: { key: string } };
const isDaily = (d: unknown): d is Daily => typeof d === 'object' && d !== null && typeof (d as Daily).card?.key === 'string';
type Draw = { reading: { cards: unknown[] } };
const isDraw = (n: 1 | 3) => (d: unknown): d is Draw => (d as Draw)?.reading?.cards?.length === n;
const DAILY: Daily = { date: '2026-10-18', card: { key: 'fool' } };

// ── Midnight ────────────────────────────────────────────────

test('next local midnight in Sofia (UTC+3 in summer time)', () => {
  const now = new Date('2026-10-18T12:00:00Z'); // 15:00 in Sofia
  assert.equal(nextLocalMidnight('Europe/Sofia', now).toISOString(), '2026-10-18T21:00:00.000Z');
});

test('next local midnight across the end of summer time (Sofia, 25 Oct 2026)', () => {
  const now = new Date('2026-10-25T12:00:00Z'); // clocks went back at 04:00 local; now UTC+2
  assert.equal(nextLocalMidnight('Europe/Sofia', now).toISOString(), '2026-10-25T22:00:00.000Z');
});

test('next local midnight a second before midnight is that midnight', () => {
  const now = new Date('2026-10-18T20:59:59Z'); // 23:59:59 in Sofia
  assert.equal(nextLocalMidnight('Europe/Sofia', now).toISOString(), '2026-10-18T21:00:00.000Z');
});

test('today\'s card is kept until local midnight and gone after it', () => {
  const s = new Mem();
  const saved = new Date('2026-10-18T12:00:00Z');
  takeVisitorId(s, saved, () => ID);
  saveDaily(s, ID, '2026-10-18', 'Europe/Sofia', DAILY, saved);
  assert.equal(readDaily(s, 'Europe/Sofia', isDaily, new Date('2026-10-18T20:59:59Z'))?.data.card.key, 'fool');
  assert.equal(readDaily(s, 'Europe/Sofia', isDaily, new Date('2026-10-18T21:00:00Z')), null);
  assert.equal(s.getItem(TAROT_KEYS.daily), null, 'expired record is removed');
  assert.ok(s.getItem(TAROT_KEYS.visitor), 'visitor id is untouched');
});

// ── Time zone changes ───────────────────────────────────────

test('a time-zone change that moves to another calendar day clears the card', () => {
  const s = new Mem();
  const saved = new Date('2026-10-18T22:30:00Z'); // 01:30 on 19 Oct in Sofia
  takeVisitorId(s, saved, () => ID);
  saveDaily(s, ID, '2026-10-19', 'Europe/Sofia', DAILY, saved);
  // Same instant, viewed from New York: still 18 Oct there.
  assert.equal(readDaily(s, 'America/New_York', isDaily, saved), null);
  assert.equal(s.getItem(TAROT_KEYS.daily), null);
});

test('a time-zone change within the same calendar day keeps the card until the saved midnight', () => {
  const s = new Mem();
  const saved = new Date('2026-10-18T09:00:00Z'); // 12:00 in Sofia, 10:00 in London
  takeVisitorId(s, saved, () => ID);
  saveDaily(s, ID, '2026-10-18', 'Europe/Sofia', DAILY, saved);
  assert.ok(readDaily(s, 'Europe/London', isDaily, new Date('2026-10-18T15:00:00Z')));
  // After Sofia's midnight the record has expired, even though it is still 18 Oct in London.
  assert.equal(readDaily(s, 'Europe/London', isDaily, new Date('2026-10-18T21:30:00Z')), null);
});

test('an unknown time zone falls back to UTC', () => {
  assert.equal(localDay('Not/AZone', new Date('2026-10-18T23:30:00Z')), '2026-10-18');
});

// ── Visitor id ──────────────────────────────────────────────

test('visitor id is reused and its last use refreshed', () => {
  const s = new Mem();
  const t0 = new Date('2026-01-01T00:00:00Z');
  assert.equal(takeVisitorId(s, t0, () => ID), ID);
  const t1 = new Date('2026-06-01T00:00:00Z');
  assert.equal(takeVisitorId(s, t1, () => OTHER), ID);
  assert.deepEqual(s.json(TAROT_KEYS.visitor), { v: TAROT_SCHEMA, id: ID, lastUsed: t1.toISOString() });
});

test('visitor id expires after 365 days without use', () => {
  const s = new Mem();
  const t0 = new Date('2025-01-01T00:00:00Z');
  takeVisitorId(s, t0, () => ID);
  assert.ok(readVisitor(s, new Date(t0.getTime() + VISITOR_TTL_MS)));
  assert.equal(readVisitor(s, new Date(t0.getTime() + VISITOR_TTL_MS + 1000)), null);
  assert.equal(s.getItem(TAROT_KEYS.visitor), null);
  assert.equal(takeVisitorId(s, new Date(t0.getTime() + VISITOR_TTL_MS + 2000), () => OTHER), OTHER);
});

test('a new visitor id makes the stored daily card invalid', () => {
  const s = new Mem();
  const t0 = new Date('2026-10-18T09:00:00Z');
  saveDaily(s, OTHER, '2026-10-18', 'Europe/Sofia', DAILY, t0);
  takeVisitorId(s, t0, () => ID);
  assert.equal(readDaily(s, 'Europe/Sofia', isDaily, t0), null);
});

// ── Last draw ──────────────────────────────────────────────

test('last draw expires after 30 days', () => {
  const s = new Mem();
  const t0 = new Date('2026-10-01T10:00:00Z');
  saveDraw(s, 3, 'What should I notice?', { reading: { cards: [1, 2, 3] } }, t0);
  assert.equal(readDraw(s, 3, isDraw(3), new Date(t0.getTime() + DRAW_TTL_MS))?.question, 'What should I notice?');
  assert.equal(readDraw(s, 3, isDraw(3), new Date(t0.getTime() + DRAW_TTL_MS + 1000)), null);
  assert.equal(s.getItem(TAROT_KEYS.draw(3)), null);
});

test('start over clears only that draw', () => {
  const s = new Mem();
  const t0 = new Date('2026-10-18T10:00:00Z');
  saveDraw(s, 1, '', { reading: { cards: [1] } }, t0);
  saveDraw(s, 3, '', { reading: { cards: [1, 2, 3] } }, t0);
  clearDraw(s, 1);
  assert.equal(s.getItem(TAROT_KEYS.draw(1)), null);
  assert.ok(s.getItem(TAROT_KEYS.draw(3)));
});

// ── Migration from current (unversioned) values ────────────

test('legacy bare UUID visitor id is migrated with last use = now', () => {
  const s = new Mem();
  s.setItem(TAROT_KEYS.visitor, JSON.stringify(ID));
  const now = new Date('2026-10-18T10:00:00Z');
  assert.equal(readVisitor(s, now)?.id, ID);
  assert.deepEqual(s.json(TAROT_KEYS.visitor), { v: TAROT_SCHEMA, id: ID, lastUsed: now.toISOString() });
});

test('legacy daily card from today is migrated with an expiry at local midnight', () => {
  const s = new Mem();
  s.setItem(TAROT_KEYS.visitor, JSON.stringify(ID));
  s.setItem(TAROT_KEYS.daily, JSON.stringify({ visitorId: ID, day: '2026-10-18', data: DAILY }));
  const now = new Date('2026-10-18T12:00:00Z');
  assert.equal(readDaily(s, 'Europe/Sofia', isDaily, now)?.data.card.key, 'fool');
  const rec = s.json(TAROT_KEYS.daily);
  assert.equal(rec.v, TAROT_SCHEMA);
  assert.equal(rec.expiresAt, '2026-10-18T21:00:00.000Z');
});

test('legacy daily card from an earlier day is removed', () => {
  const s = new Mem();
  s.setItem(TAROT_KEYS.visitor, JSON.stringify(ID));
  s.setItem(TAROT_KEYS.daily, JSON.stringify({ visitorId: ID, day: '2026-10-17', data: DAILY }));
  assert.equal(readDaily(s, 'Europe/Sofia', isDaily, new Date('2026-10-18T12:00:00Z')), null);
  assert.equal(s.getItem(TAROT_KEYS.daily), null);
});

test('legacy draw without a timestamp is migrated with saved time = now', () => {
  const s = new Mem();
  s.setItem(TAROT_KEYS.draw(1), JSON.stringify({ question: 'Q', data: { reading: { cards: [1] } } }));
  const now = new Date('2026-10-18T12:00:00Z');
  assert.equal(readDraw(s, 1, isDraw(1), now)?.question, 'Q');
  assert.equal(s.json(TAROT_KEYS.draw(1)).savedAt, now.toISOString());
});

// ── Malformed values: only the invalid Tarot key is cleared ─

test('malformed and unknown-version values are removed; other keys stay', () => {
  const s = new Mem();
  s.setItem('sq.other', 'keep me');
  s.setItem('theme', 'dark');
  s.setItem(TAROT_KEYS.visitor, '{not json');
  s.setItem(TAROT_KEYS.daily, JSON.stringify({ v: 99, visitorId: ID, day: '2026-10-18', expiresAt: '2030-01-01T00:00:00Z', data: DAILY }));
  s.setItem(TAROT_KEYS.draw(1), JSON.stringify({ v: TAROT_SCHEMA, savedAt: 'yesterday', question: 'Q', data: { reading: { cards: [1] } } }));
  s.setItem(TAROT_KEYS.draw(3), JSON.stringify({ v: TAROT_SCHEMA, savedAt: '2026-10-18T00:00:00Z', question: 'Q', data: { reading: { cards: [1] } } })); // wrong card count
  sweepTarotStorage(s, 'Europe/Sofia', isDaily, isDraw, new Date('2026-10-18T12:00:00Z'));
  assert.deepEqual([...s.map.keys()].sort(), ['sq.other', 'theme']);
});

test('valid records survive a sweep', () => {
  const s = new Mem();
  const now = new Date('2026-10-18T12:00:00Z');
  takeVisitorId(s, now, () => ID);
  saveDaily(s, ID, '2026-10-18', 'Europe/Sofia', DAILY, now);
  saveDraw(s, 1, '', { reading: { cards: [1] } }, now);
  sweepTarotStorage(s, 'Europe/Sofia', isDaily, isDraw, now);
  assert.equal(s.map.size, 3);
});

test('blocked storage never throws', () => {
  const broken: KeyValueStore = {
    getItem() { throw new Error('blocked'); },
    setItem() { throw new Error('blocked'); },
    removeItem() { throw new Error('blocked'); },
  };
  assert.equal(takeVisitorId(broken, new Date(), () => ID), ID);
  assert.equal(readDaily(broken, 'Europe/Sofia', isDaily), null);
  assert.doesNotThrow(() => saveDraw(broken, 1, '', {}));
});
