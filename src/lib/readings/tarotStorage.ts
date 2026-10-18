/**
 * Tarot data kept in the visitor's browser, with expiry (owner decision D8,
 * 18 Oct 2026). Every record carries a schema version and timestamps:
 *  - sq.visitor         { v, id, lastUsed }            expires 365 days after last use
 *  - sq.tarot.daily     { v, visitorId, day, expiresAt, data }
 *                                                       expires at the next local midnight
 *  - sq.tarot.draw.1/3  { v, savedAt, question, data }  expires 30 days after it was saved
 * Values written before versioning (a bare UUID string, a daily record
 * without expiresAt, a draw without savedAt) are migrated once. Anything
 * malformed or expired is removed, and only that Tarot key is touched.
 *
 * Pure functions over a small storage interface so they can be tested
 * without a browser; src/lib/readings/local.ts binds them to localStorage.
 */

export const TAROT_SCHEMA = 1;

export const TAROT_KEYS = {
  visitor: 'sq.visitor',
  daily: 'sq.tarot.daily',
  draw: (count: 1 | 3) => `sq.tarot.draw.${count}`,
} as const;

const DAY_MS = 24 * 60 * 60 * 1000;
export const VISITOR_TTL_MS = 365 * DAY_MS;
export const DRAW_TTL_MS = 30 * DAY_MS;

/** The parts of Storage used here; every call may throw (blocked storage). */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface VisitorRecord { v: number; id: string; lastUsed: string }
export interface DailyRecord<T> { v: number; visitorId: string; day: string; expiresAt: string; data: T }
export interface DrawRecord<T> { v: number; savedAt: string; question: string; data: T }

/** Today's date (YYYY-MM-DD) in a time zone; UTC when the zone is unknown. */
export function localDay(tz: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}

/**
 * The first instant after `now` that belongs to the next calendar day in
 * `tz`. Found by bisection, so daylight-saving changes need no offset table.
 */
export function nextLocalMidnight(tz: string, now = new Date()): Date {
  const today = localDay(tz, now);
  let lo = now.getTime();
  let hi = lo + 2 * DAY_MS;
  while (hi - lo > 1) {
    const mid = lo + Math.floor((hi - lo) / 2);
    if (localDay(tz, new Date(mid)) === today) lo = mid;
    else hi = mid;
  }
  return new Date(hi);
}

function read(store: KeyValueStore, key: string): { raw: string | null; value: unknown } {
  try {
    const raw = store.getItem(key);
    if (raw === null) return { raw, value: null };
    try {
      return { raw, value: JSON.parse(raw) };
    } catch {
      return { raw, value: undefined }; // malformed
    }
  } catch {
    return { raw: null, value: null }; // storage unavailable
  }
}

function write(store: KeyValueStore, key: string, value: unknown): void {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the value simply isn't kept.
  }
}

function remove(store: KeyValueStore, key: string): void {
  try {
    store.removeItem(key);
  } catch {
    // ignore
  }
}

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const validTime = (v: unknown): v is string => typeof v === 'string' && !Number.isNaN(Date.parse(v));

// ── Visitor id ──────────────────────────────────────────────

/** The stored visitor record if it is valid and unexpired; otherwise removes it. */
export function readVisitor(store: KeyValueStore, now = new Date()): VisitorRecord | null {
  const { raw, value } = read(store, TAROT_KEYS.visitor);
  if (raw === null) return null;
  // Legacy: a bare UUID string with no timestamp. Its age is unknown, so the 365 days start now.
  if (typeof value === 'string' && UUID_RE.test(value)) {
    const migrated: VisitorRecord = { v: TAROT_SCHEMA, id: value, lastUsed: now.toISOString() };
    write(store, TAROT_KEYS.visitor, migrated);
    return migrated;
  }
  if (
    isObject(value) && value.v === TAROT_SCHEMA && typeof value.id === 'string' && UUID_RE.test(value.id) &&
    validTime(value.lastUsed) && now.getTime() - Date.parse(value.lastUsed) <= VISITOR_TTL_MS
  ) {
    return { v: TAROT_SCHEMA, id: value.id, lastUsed: value.lastUsed };
  }
  remove(store, TAROT_KEYS.visitor);
  return null;
}

/** The visitor id for a request: reuses a valid one (refreshing its last use) or creates a new one. */
export function takeVisitorId(store: KeyValueStore, now = new Date(), newId: () => string = () => crypto.randomUUID()): string {
  const id = readVisitor(store, now)?.id ?? newId();
  write(store, TAROT_KEYS.visitor, { v: TAROT_SCHEMA, id, lastUsed: now.toISOString() } satisfies VisitorRecord);
  return id;
}

// ── Card of the day ─────────────────────────────────────────

/**
 * Today's stored card for this visitor, or null. A record is kept only while
 * it is before its expiry (the next local midnight when it was saved), its
 * day is still today in the visitor's current time zone, and it belongs to
 * the current visitor id. Otherwise it is removed.
 */
export function readDaily<T>(store: KeyValueStore, tz: string, isData: (d: unknown) => d is T, now = new Date()): DailyRecord<T> | null {
  const { raw, value } = read(store, TAROT_KEYS.daily);
  if (raw === null) return null;
  const visitor = readVisitor(store, now);
  const today = localDay(tz, now);
  if (isObject(value) && typeof value.visitorId === 'string' && typeof value.day === 'string' && DAY_RE.test(value.day) && isData(value.data)) {
    const sameVisitor = visitor !== null && visitor.id === value.visitorId;
    if (value.v === undefined && value.expiresAt === undefined && sameVisitor && value.day === today) {
      // Legacy record from today: keep it until the coming local midnight.
      const migrated: DailyRecord<T> = { v: TAROT_SCHEMA, visitorId: value.visitorId, day: value.day, expiresAt: nextLocalMidnight(tz, now).toISOString(), data: value.data };
      write(store, TAROT_KEYS.daily, migrated);
      return migrated;
    }
    if (
      value.v === TAROT_SCHEMA && validTime(value.expiresAt) && now.getTime() < Date.parse(value.expiresAt) &&
      sameVisitor && value.day === today
    ) {
      return { v: TAROT_SCHEMA, visitorId: value.visitorId, day: value.day, expiresAt: value.expiresAt, data: value.data };
    }
  }
  remove(store, TAROT_KEYS.daily);
  return null;
}

export function saveDaily<T>(store: KeyValueStore, visitorId: string, day: string, tz: string, data: T, now = new Date()): void {
  write(store, TAROT_KEYS.daily, { v: TAROT_SCHEMA, visitorId, day, expiresAt: nextLocalMidnight(tz, now).toISOString(), data } satisfies DailyRecord<T>);
}

// ── One or three cards ─────────────────────────────────────

/** The last completed draw if it is under 30 days old; otherwise removes it. */
export function readDraw<T>(store: KeyValueStore, count: 1 | 3, isData: (d: unknown) => d is T, now = new Date()): DrawRecord<T> | null {
  const key = TAROT_KEYS.draw(count);
  const { raw, value } = read(store, key);
  if (raw === null) return null;
  if (isObject(value) && typeof value.question === 'string' && isData(value.data)) {
    if (value.v === undefined && value.savedAt === undefined) {
      // Legacy draw without a timestamp: its age is unknown, so the 30 days start now.
      const migrated: DrawRecord<T> = { v: TAROT_SCHEMA, savedAt: now.toISOString(), question: value.question, data: value.data };
      write(store, key, migrated);
      return migrated;
    }
    if (value.v === TAROT_SCHEMA && validTime(value.savedAt) && now.getTime() - Date.parse(value.savedAt) <= DRAW_TTL_MS) {
      return { v: TAROT_SCHEMA, savedAt: value.savedAt, question: value.question, data: value.data };
    }
  }
  remove(store, key);
  return null;
}

export function saveDraw<T>(store: KeyValueStore, count: 1 | 3, question: string, data: T, now = new Date()): void {
  write(store, TAROT_KEYS.draw(count), { v: TAROT_SCHEMA, savedAt: now.toISOString(), question, data } satisfies DrawRecord<T>);
}

export function clearDraw(store: KeyValueStore, count: 1 | 3): void {
  remove(store, TAROT_KEYS.draw(count));
}

/** Validate and expire every Tarot key once (e.g. on page load); other keys are never touched. */
export function sweepTarotStorage(
  store: KeyValueStore,
  tz: string,
  isDaily: (d: unknown) => boolean,
  isDraw: (count: 1 | 3) => (d: unknown) => boolean,
  now = new Date(),
): void {
  readVisitor(store, now);
  readDaily(store, tz, isDaily as (d: unknown) => d is unknown, now);
  readDraw(store, 1, isDraw(1) as (d: unknown) => d is unknown, now);
  readDraw(store, 3, isDraw(3) as (d: unknown) => d is unknown, now);
}
