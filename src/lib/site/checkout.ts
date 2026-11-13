/**
 * Stripe checkout return page /{lang}/checkout/done (API_CONTRACT_V1.md, "Website payments with
 * Stripe, test mode" → "As built"). Stripe returns to `…/checkout/done?checkout=success&session_id=…`
 * or `?checkout=cancelled`. The page only reads `checkout`: it never calls the backend and never
 * reads, shows or logs `session_id` (the app confirms the membership from the server itself).
 */

/** The app's membership screen (scheme from SoulMates-Quest-mobile/app.json, app/settings/membership.tsx). */
export const CHECKOUT_DEEP_LINK = 'soulmatesquest://settings/membership';

export type CheckoutState = 'success' | 'cancelled' | 'unknown';

/** The state from the `checkout` query value; anything else (missing, repeated, unknown) is neutral. */
export function checkoutState(value: string | string[] | undefined): CheckoutState {
  if (value === 'success') return 'success';
  if (value === 'cancelled') return 'cancelled';
  return 'unknown';
}

export type CheckoutText = {
  metaTitle: string;
  success: { title: string; body: string };
  cancelled: { title: string; body: string };
  unknown: { title: string; body: string };
  openApp: string;
  openNote: string;
};

/** What the page shows for a state: a title, one paragraph, the Open the app button and its note. */
export function checkoutView(t: CheckoutText, state: CheckoutState) {
  const { title, body } = t[state];
  return { title, body, button: t.openApp, href: CHECKOUT_DEEP_LINK, note: t.openNote };
}

/** /checkout/… with or without a language prefix. */
export const CHECKOUT_PATH = /^\/(?:(?:en|bg)\/)?checkout(?:\/.*)?$/;

/**
 * The query without `session_id` (every other parameter kept, in order). src/proxy.ts redirects
 * checkout URLs to it, so the page, its HTML and its RSC payload never contain the session id.
 */
export function stripSessionId(search: string): string {
  const params = new URLSearchParams(search);
  if (!params.has('session_id')) return search;
  params.delete('session_id');
  const rest = params.toString();
  return rest ? `?${rest}` : '';
}
