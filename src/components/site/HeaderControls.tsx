'use client';

/**
 * Header controls: main navigation (current page marked), language switch
 * (keeps the current page). The theme has no switch: it follows the local
 * time (src/lib/design/tokens.ts).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
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

/**
 * Compact language menu, as in PrintVes and Creator OS: a small globe + code
 * button opening a list of languages (code, full name, check on the current
 * one). Keeps the current page; closes on outside click or Escape.
 */
export function LangSwitch({ lang, label }: { lang: Locale; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '');
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="locale-switcher" ref={box}>
      <button
        type="button"
        className="locale-trigger"
        aria-label={`${label}: ${LOCALE_INFO[lang].label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe aria-hidden />
        <span>{lang.toUpperCase()}</span>
        <ChevronDown aria-hidden className="locale-chevron" />
      </button>
      {open ? (
        <div className="locale-menu" id={menuId} role="menu" aria-label={label}>
          {LOCALES.map((l) => (
            <Link
              key={l}
              role="menuitem"
              href={`/${l}${rest}`}
              hrefLang={l}
              lang={l}
              scroll={false}
              aria-current={l === lang ? 'true' : undefined}
              className={l === lang ? 'is-current' : undefined}
              onClick={() => setOpen(false)}
            >
              <span className="locale-name"><span className="locale-code">{l.toUpperCase()}</span>{LOCALE_INFO[l].label}</span>
              {l === lang ? <Check aria-hidden /> : null}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
