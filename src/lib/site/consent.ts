/**
 * The visitor's choice about Google Analytics (owner decision, 19 Oct 2026).
 * Google Analytics loads only after the visitor presses Accept; with Reject,
 * or no choice yet, nothing is requested from Google. The choice is kept in
 * localStorage (key below) for CONSENT_TTL_MS, then the banner asks again.
 * Every access is guarded: storage can be missing or throw, and then the
 * choice lasts only for the current page.
 */

export type ConsentChoice = 'granted' | 'denied';

export const CONSENT_KEY = 'sq.consent.analytics';
export const CONSENT_SCHEMA = 1;
/** A choice is asked again after a year. */
export const CONSENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export interface ConsentStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

type Stored = { v: number; choice: ConsentChoice; at: number };

/** The stored choice, or null when there is none, it is invalid or it has expired. */
export function readConsent(store: ConsentStore, now = Date.now()): ConsentChoice | null {
  try {
    const raw = store.getItem(CONSENT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Partial<Stored> | null;
    const valid = d && d.v === CONSENT_SCHEMA && (d.choice === 'granted' || d.choice === 'denied') &&
      typeof d.at === 'number' && d.at <= now && now - d.at < CONSENT_TTL_MS;
    if (valid) return d.choice as ConsentChoice;
    store.removeItem(CONSENT_KEY);
  } catch {
    // unreadable storage or record: no choice
  }
  return null;
}

/** Saves the choice; returns false when the browser does not allow storage. */
export function saveConsent(store: ConsentStore, choice: ConsentChoice, now = Date.now()): boolean {
  try {
    const record: Stored = { v: CONSENT_SCHEMA, choice, at: now };
    store.setItem(CONSENT_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

/** Origin + path, no query or fragment, a private quiz code replaced. */
export function safeUrl(url: string): string {
  const bare = url.split(/[?#]/)[0];
  return bare.replace(/\/quiz\/(?!answer\/)[^/]+/, '/quiz/[code]');
}

/** Google Analytics cookie names (_ga, _ga_<id>, _gid, _gat…), for removal after a withdrawal. */
export function isGoogleAnalyticsCookie(name: string): boolean {
  return /^_ga($|_)|^_gid$|^_gat/.test(name);
}

/** The domains a cookie for this host may have been set on: the host and each parent domain. */
export function cookieDomains(hostname: string): string[] {
  const parts = hostname.split('.');
  const out: string[] = [];
  for (let i = 0; i < parts.length - 1; i++) out.push(parts.slice(i).join('.'));
  return out.length ? out : [hostname];
}
