/**
 * What the website keeps in the visitor's browser (localStorage only; no
 * cookies, nothing sent anywhere unless a tool says so):
 *  - sq.visitor          random UUID for the tarot card of the day
 *  - sq.tarot.daily      today's card, so it shows again without a request
 *  - sq.tarot.draw.1/3   the last completed draw (and its question), so a
 *                        refresh never redraws by accident
 *  - sq.theme            light | dark (absent = follow the system)
 * Every access is guarded: storage can be missing or throw (private windows,
 * blocked site data), and the tools still work without it.
 */

export const STORAGE_KEYS = {
  visitor: 'sq.visitor',
  daily: 'sq.tarot.daily',
  draw: (count: 1 | 3) => `sq.tarot.draw.${count}`,
  theme: 'sq.theme',
} as const;

export function readJson<T>(key: string): T | null {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable: the result simply isn't kept.
  }
}

export function removeKey(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** This browser's random visitor identifier, created on first use. */
export function visitorId(): string {
  const existing = readJson<string>(STORAGE_KEYS.visitor);
  if (existing && UUID_RE.test(existing)) return existing;
  const id = crypto.randomUUID();
  writeJson(STORAGE_KEYS.visitor, id);
  return id;
}

/** Today's date (YYYY-MM-DD) in a time zone. */
export function localDay(tz: string, now = new Date()): string {
  try {
    return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  } catch {
    return now.toISOString().slice(0, 10);
  }
}
