'use client';

/**
 * Header controls: main navigation (current page marked), language switch
 * (keeps the current page). The theme has no switch: it follows the local
 * time (src/lib/design/tokens.ts).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_INFO, type Locale } from '@/i18n/config';

export interface NavItem { href: string; label: string }

function isCurrent(pathname: string, href: string, lang: Locale) {
  if (href === `/${lang}`) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ items, lang, className, label }: { items: NavItem[]; lang: Locale; className: string; label: string }) {
  const pathname = usePathname() ?? '';
  return (
    <nav className={className} aria-label={label}>
      {className.includes('mobile') ? (
        <div className="wrap">
          {items.map((item) => (
            <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href, lang) ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
        </div>
      ) : (
        items.map((item) => (
          <Link key={item.href} href={item.href} aria-current={isCurrent(pathname, item.href, lang) ? 'page' : undefined}>
            {item.label}
          </Link>
        ))
      )}
    </nav>
  );
}

export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  return (
    <nav className="segmented" aria-label={label}>
      {LOCALES.map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          title={LOCALE_INFO[l].label}
          aria-current={l === lang ? 'true' : undefined}
          scroll={false}
        >
          {LOCALE_INFO[l].short}
        </Link>
      ))}
    </nav>
  );
}
