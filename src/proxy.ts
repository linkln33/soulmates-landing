/**
 * Language entry: portal paths without a language prefix (`/`, `/tarot`,
 * the old `/app`, the app's `/privacy` and `/terms` links, …) redirect to the visitor's language from
 * Accept-Language (English otherwise). No cookies are set. The quiz, API-free static files and already-prefixed paths pass through.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { localeFromAcceptLanguage } from '@/i18n/config';

const UNPREFIXED = /^\/(?:horoscope|tarot|numbers|moon|app|about|privacy|terms|safety|delete-account)(?:\/.*)?$/;

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname !== '/' && !UNPREFIXED.test(pathname)) return NextResponse.next();
  const lang = localeFromAcceptLanguage(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = `/${lang}${pathname === '/' ? '' : pathname}`;
  url.search = search;
  const res = NextResponse.redirect(url, 307);
  res.headers.set('Vary', 'Accept-Language');
  return res;
}

export const config = {
  matcher: ['/', '/horoscope/:path*', '/tarot/:path*', '/numbers/:path*', '/moon/:path*', '/app/:path*', '/about', '/privacy', '/terms', '/safety', '/delete-account'],
};
