/** Portal header and footer (server components; interactive parts in HeaderControls). */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { CONTACT_EMAIL } from '@/lib/site/config';
import { LangSwitch, NavLinks, ThemeSwitch, type NavItem } from './HeaderControls';

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
          <img src="/app-content/logo.png" alt="" width={1373} height={655} />
          <span>{t.siteName}</span>
        </Link>
        <NavLinks items={items} lang={lang} className="site-nav" label={t.nav.label} />
        <div className="header-tools">
          <LangSwitch lang={lang} label={t.language} />
          <ThemeSwitch labels={t.theme} />
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
              <img src="/app-content/logo.png" alt="" width={1373} height={655} />
              <span style={{ display: 'inline' }}>{t.siteName}</span>
            </Link>
            <p className="small muted">{t.footer.tagline}</p>
          </div>
          <div>
            <h2>{t.footer.tools}</h2>
            <ul>
              <li><Link href={`/${lang}/horoscope`}>{t.tools.horoscope.title}</Link></li>
              <li><Link href={`/${lang}/tarot`}>{t.tools.tarot.title}</Link></li>
              <li><Link href={`/${lang}/numbers`}>{t.tools.numbers.title}</Link></li>
              <li><Link href={`/${lang}/moon`}>{t.tools.moon.title}</Link></li>
            </ul>
          </div>
          <div>
            <h2>{t.footer.about}</h2>
            <ul>
              <li><Link href={`/${lang}/app`}>{t.nav.app}</Link></li>
              <li><Link href="/privacy">{t.footer.privacy}</Link></li>
              <li><Link href="/terms">{t.footer.terms}</Link></li>
              <li><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
            </ul>
          </div>
        </div>
        <p className="note small subtle">{t.footer.note} © {new Date().getFullYear()} SoulMates Quest</p>
      </div>
    </footer>
  );
}
