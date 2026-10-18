/** Portal header and footer (server components; interactive parts in HeaderControls). */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { footerLinks } from '@/lib/site/footer';
import { LangSwitch, NavLinks, type NavItem } from './HeaderControls';

function navItems(lang: Locale): NavItem[] {
  const t = site(lang).nav;
  return [
    { href: `/${lang}/horoscope`, label: t.horoscope },
    { href: `/${lang}/tarot`, label: t.tarot },
    { href: `/${lang}/numbers`, label: t.numbers },
    { href: `/${lang}/moon`, label: t.moon },
    { href: `/${lang}/app`, label: t.app },
  ];
}

export function SiteHeader({ lang }: { lang: Locale }) {
  const t = site(lang);
  const items = navItems(lang);
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">{t.skipToContent}</a>
      <div className="wrap">
        <Link href={`/${lang}`} className="brand" aria-label={`${t.siteName} — ${t.nav.home}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-56.webp" srcSet="/brand/logo-56.webp 1x, /brand/logo-112.webp 2x, /brand/logo-168.webp 3x" alt="" width={56} height={27} />
          <span>{t.siteName}</span>
        </Link>
        <NavLinks items={items} lang={lang} className="site-nav" label={t.nav.label} />
        <div className="header-tools">
          <LangSwitch lang={lang} label={t.language} />
        </div>
      </div>
      <NavLinks items={items} lang={lang} className="mobile-nav" label={t.nav.menu} />
    </header>
  );
}

export function SiteFooter({ lang }: { lang: Locale }) {
  const t = site(lang);
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="cols">
          <div className="stack">
            <Link href={`/${lang}`} className="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-56.webp" srcSet="/brand/logo-56.webp 1x, /brand/logo-112.webp 2x, /brand/logo-168.webp 3x" alt="" width={56} height={27} />
              <span style={{ display: 'inline' }}>{t.siteName}</span>
            </Link>
            <p className="small muted">{t.footer.tagline}</p>
          </div>
          <nav aria-label={t.footer.navLabel}>
            <ul className="footer-links">
              {footerLinks(lang).map(({ key, href }) => (
                <li key={key}>
                  {href.startsWith('mailto:') ? <a href={href}>{t.footer.links[key]}</a> : <Link href={href}>{t.footer.links[key]}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="note small subtle">{t.footer.note} © {new Date().getFullYear()} SoulMates Quest</p>
      </div>
    </footer>
  );
}
