/**
 * Invitation (referral) links: /r/<code> (API contract "Invites (referrals), Phase 1", 11 Nov 2026).
 * A code is compared after trim + lowercase and must match ^[a-z0-9-]{4,32}$.
 * The visitor's browser checks it with POST {API}/referrals/validate (public), like the quiz
 * pages, so the API rate-limits each visitor by their own IP. Nothing is cached (`no-store`),
 * so a failure is never remembered. No imports: safe for client and server code and node --test.
 */

export const REFERRAL_CODE_RE = /^[a-z0-9-]{4,32}$/;

/** App deep link that opens the invitation in the installed app. */
export const referralDeepLink = (code: string) => `soulmatesquest://r/${code}`;

/** Milliseconds to wait for the API before showing the page without a name. */
export const VALIDATE_TIMEOUT_MS = 8000;

/** The normalised code, or null when it can't be a code. */
export function normalizeReferralCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    return null;
  }
  const code = value.trim().toLowerCase();
  return REFERRAL_CODE_RE.test(code) ? code : null;
}

export type ReferralCheck =
  | { status: 'valid'; firstName: string | null }
  | { status: 'invalid' }
  | { status: 'unavailable' };

/** The referrer's first name as shown on the page: a trimmed short string, else null. */
export function cleanFirstName(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const name = value.replace(/\s+/g, ' ').trim();
  if (!name || name.length > 60) return null;
  return name;
}

type FetchLike = (input: string, init: RequestInit) => Promise<Pick<Response, 'status' | 'ok' | 'json'>>;

/**
 * Checks a code. `invalid` for a malformed code (no request), 404 or 400;
 * `unavailable` for a network error, timeout, rate limit, 5xx or an unexpected answer.
 */
export async function validateReferralCode(
  raw: unknown,
  { apiBase, fetchImpl = fetch as FetchLike, timeoutMs = VALIDATE_TIMEOUT_MS }: { apiBase: string; fetchImpl?: FetchLike; timeoutMs?: number },
): Promise<ReferralCheck> {
  const code = normalizeReferralCode(raw);
  if (!code) return { status: 'invalid' };
  if (!apiBase) return { status: 'unavailable' };
  try {
    const res = await fetchImpl(`${apiBase.replace(/\/+$/, '')}/referrals/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ code }),
      cache: 'no-store',
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (res.status === 404 || res.status === 400) return { status: 'invalid' };
    if (!res.ok) return { status: 'unavailable' };
    const body = (await res.json()) as { valid?: unknown; referrer?: { firstName?: unknown } | null } | null;
    if (body?.valid !== true) return { status: 'unavailable' };
    return { status: 'valid', firstName: cleanFirstName(body.referrer?.firstName) };
  } catch {
    return { status: 'unavailable' };
  }
}
