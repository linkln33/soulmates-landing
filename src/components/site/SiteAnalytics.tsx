'use client';

/**
 * Site analytics and the cookie banner (owner decisions, 19 Oct 2026).
 *
 * - Google Analytics 4 loads ONLY after the visitor presses Accept. Before
 *   that, with Reject, or with no choice, the page has no gtag or
 *   googletagmanager script, no dataLayer and no Google cookies. The script
 *   is added to the page here, on the client, after the choice is known; the
 *   server HTML never contains it.
 * - The choice is kept in localStorage (src/lib/site/consent.ts) and can be
 *   changed with "Cookie settings" (CookieSettingsButton), which reopens the
 *   banner. Withdrawing removes Google's cookies and reloads the page so the
 *   already loaded script stops.
 * - Vercel Web Analytics sets no cookies and stores nothing in the browser, so
 *   it runs regardless of the choice, as the privacy notice says.
 *
 * Neither tool ever receives a secret: private quiz links carry their code in
 * the path (/quiz/<code>) and the answer-deletion page its token in the query,
 * so every reported URL (and the referrer) is cut to origin + path, with a
 * quiz code replaced by "[code]".
 */
import { useCallback, useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import {
  cookieDomains,
  isGoogleAnalyticsCookie,
  readConsent,
  safeUrl,
  saveConsent,
  type ConsentChoice,
  type ConsentStore,
} from '@/lib/site/consent';

export const GA_MEASUREMENT_ID = 'G-KJK7PCFVSC';
/** Dispatched on window by CookieSettingsButton to reopen the banner. */
export const OPEN_CONSENT_EVENT = 'sq:cookie-settings';

export type ConsentText = {
  title: string;
  body: string;
  privacyLink: string;
  accept: string;
  reject: string;
  currentGranted: string;
  currentDenied: string;
  settings: string;
};

function store(): ConsentStore {
  try {
    const s = window.localStorage;
    if (s) return s;
  } catch {
    // fall through
  }
  return { getItem: () => null, setItem: () => {}, removeItem: () => {} };
}

type GtagWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void } & Record<string, unknown>;

/** Adds gtag.js once, after consent. page_location and page_referrer are safe URLs. */
function loadGoogleAnalytics() {
  const w = window as unknown as GtagWindow;
  if (document.getElementById('ga4-gtag')) return;
  w[`ga-disable-${GA_MEASUREMENT_ID}`] = false;
  w.dataLayer = w.dataLayer || [];
  // gtag must push the arguments object itself.
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function gtag() { w.dataLayer!.push(arguments); };
  w.gtag('js', new Date());
  w.gtag('config', GA_MEASUREMENT_ID, { page_location: safeUrl(location.href), page_referrer: safeUrl(document.referrer) });
  const s = document.createElement('script');
  s.id = 'ga4-gtag';
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s);
}

/** Removes Google Analytics cookies on this host and its parent domains. */
function removeGoogleCookies() {
  try {
    const names = document.cookie.split(';').map((c) => c.split('=')[0].trim()).filter(isGoogleAnalyticsCookie);
    for (const name of names) {
      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (const domain of cookieDomains(location.hostname)) document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
    }
  } catch {
    // cookies unavailable: nothing to remove
  }
}

export default function SiteAnalytics({ text, privacyHref }: { text: ConsentText; privacyHref: string }) {
  // undefined: not read yet (server render and first client render); null: no choice.
  const [choice, setChoice] = useState<ConsentChoice | null | undefined>(undefined);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = readConsent(store());
    // Reading browser storage has to wait until after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChoice(stored);
    if (stored === null) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    if (choice === 'granted') loadGoogleAnalytics();
  }, [choice]);

  const decide = useCallback((next: ConsentChoice) => {
    const wasLoaded = !!document.getElementById('ga4-gtag');
    saveConsent(store(), next);
    setChoice(next);
    setOpen(false);
    if (next === 'denied') {
      (window as unknown as GtagWindow)[`ga-disable-${GA_MEASUREMENT_ID}`] = true;
      removeGoogleCookies();
      // A script that already ran cannot be unloaded; a reload starts the page without it.
      if (wasLoaded) location.reload();
    }
  }, []);

  return (
    <>
      <Analytics beforeSend={(event) => ({ ...event, url: safeUrl(event.url) })} />
      {open && choice !== undefined ? (
        <section className="consent-banner" role="region" aria-labelledby="consent-title">
          <div className="consent-inner">
            <h2 id="consent-title" className="consent-title">{text.title}</h2>
            <p className="consent-body">
              {text.body}{' '}
              <a href={privacyHref}>{text.privacyLink}</a>
            </p>
            {choice ? <p className="consent-current">{choice === 'granted' ? text.currentGranted : text.currentDenied}</p> : null}
            <div className="consent-actions">
              <button type="button" className="btn consent-choice" onClick={() => decide('denied')}>{text.reject}</button>
              <button type="button" className="btn consent-choice" onClick={() => decide('granted')}>{text.accept}</button>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
