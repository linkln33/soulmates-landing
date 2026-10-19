'use client';

/**
 * Site analytics (owner decision, 19 Oct 2026): Google Analytics 4 and Vercel
 * Web Analytics on every page, loaded without a consent banner by the owner's
 * choice. The privacy notice (src/content/legal/privacy.*.md, "Analytics")
 * describes both.
 *
 * Neither tool ever receives a secret: private quiz links carry their code
 * in the path (/quiz/<code>) and the answer-deletion page its token in the
 * query, so every reported URL (and the referrer) is cut to origin + path,
 * with a quiz code replaced by "[code]".
 */
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';

export const GA_MEASUREMENT_ID = 'G-KJK7PCFVSC';

/** Origin + path, no query or fragment, a private quiz code replaced. */
export function safeUrl(url: string): string {
  const bare = url.split(/[?#]/)[0];
  return bare.replace(/\/quiz\/(?!answer\/)[^/]+/, '/quiz/[code]');
}

// The same rule inline for gtag (runs before React): page_location and page_referrer are safe URLs.
const GTAG_INIT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
function sqSafe(u){ if(!u) return ''; return u.split(/[?#]/)[0].replace(/\\/quiz\\/(?!answer\\/)[^/]+/, '/quiz/[code]'); }
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}', { page_location: sqSafe(location.href), page_referrer: sqSafe(document.referrer) });
`;

export default function SiteAnalytics() {
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">{GTAG_INIT}</Script>
      <Analytics beforeSend={(event) => ({ ...event, url: safeUrl(event.url) })} />
    </>
  );
}
