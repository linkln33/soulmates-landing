'use client';

/**
 * Header controls: main navigation (current page marked), language switch
 * (keeps the current page) and theme switch (System / Light / Dark; system
 * by default, the choice kept in this browser only).
 */
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Desktop, Moon, Sun } from '@phosphor-icons/react';
import { LOCALES, LOCALE_INFO, type Locale } from '@/i18n/config';
import { STORAGE_KEYS, readJson, removeKey, writeJson } from '@/lib/readings/local';

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

type ThemeChoice = 'system' | 'light' | 'dark';

export function ThemeSwitch({ labels }: { labels: { label: string; system: string; light: string; dark: string } }) {
  const [choice, setChoice] = useState<ThemeChoice>('system');

  useEffect(() => {
    const saved = readJson<string>(STORAGE_KEYS.theme);
    // Reflect the choice already applied before paint (THEME_SCRIPT).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === 'light' || saved === 'dark') setChoice(saved);
  }, []);

  function choose(next: ThemeChoice) {
    setChoice(next);
    if (next === 'system') {
      document.documentElement.removeAttribute('data-theme');
      removeKey(STORAGE_KEYS.theme);
    } else {
      document.documentElement.setAttribute('data-theme', next);
      writeJson(STORAGE_KEYS.theme, next);
    }
  }

  const options: { value: ThemeChoice; icon: React.ReactNode; text: string }[] = [
    { value: 'system', icon: <Desktop size={16} weight="bold" aria-hidden />, text: labels.system },
    { value: 'light', icon: <Sun size={16} weight="bold" aria-hidden />, text: labels.light },
    { value: 'dark', icon: <Moon size={16} weight="bold" aria-hidden />, text: labels.dark },
  ];
  return (
    <div className="segmented theme-switch" role="group" aria-label={labels.label}>
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={choice === o.value} title={o.text} aria-label={o.text} onClick={() => choose(o.value)}>
          {o.icon}
          <span className="label" aria-hidden>{o.text}</span>
        </button>
      ))}
    </div>
  );
}
