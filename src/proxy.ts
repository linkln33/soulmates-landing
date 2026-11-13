/**
 * Language entry: portal paths without a language prefix (`/`, `/tarot`,
 * the old `/app`, the app's `/privacy` and `/terms` links, invitation links `/r/<code>`, the Android help `/install`, the Stripe return `/checkout/done`, …) redirect to the visitor's language from
 * Accept-Language (English otherwise), query kept. No cookies are set. The quiz, API-free static files and already-prefixed paths pass through.
 * Checkout URLs (with or without a language) lose only Stripe's `session_id` (src/lib/site/checkout.ts), so the page never contains it.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { localeFromAcceptLanguage } from '@/i18n/config';
import { CHECKOUT_PATH, stripSessionId } from '@/lib/site/checkout';

const UNPREFIXED = /^\/(?:horoscope|tarot|numbers|moon|app|about|privacy|terms|safety|delete-account|install|checkout|r)(?:\/.*)?$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const query = CHECKOUT_PATH.test(pathname) ? stripSessionId(search) : search;
  const unprefixed = pathname === '/' || UNPREFIXED.test(pathname);
  if (!unprefixed && query === search) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.search = query;
  if (!unprefixed) return NextResponse.redirect(url, 307);
  const lang = localeFromAcceptLanguage(request.headers.get('accept-language'));
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language');
  return res;
}

export const config = {
  matcher: ['/', '/horoscope/:path*', '/tarot/:path*', '/numbers/:path*', '/moon/:path*', '/app/:path*', '/about', '/privacy', '/terms', '/safety', '/delete-account', '/install', '/checkout/:path*', '/en/checkout/:path*', '/bg/checkout/:path*', '/r/:path*'],
};
