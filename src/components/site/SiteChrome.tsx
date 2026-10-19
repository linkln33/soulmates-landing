/** Portal header and footer (server components; interactive parts in HeaderControls). */
import Link from 'next/link';
import { Download } from 'lucide-react';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { FacebookLogo, InstagramLogo, LinkedinLogo, TiktokLogo, XLogo, YoutubeLogo } from '@phosphor-icons/react/dist/ssr';
import { footerColumns } from '@/lib/site/footer';
import { socialLinks, type SocialNetwork } from '@/lib/site/social';
import StoreBadges from './StoreBadges';
import CookieSettingsButton from './CookieSettingsButton';
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
          {/* No public download yet: the button leads to the app page. Only one label is displayed at a time, so the accessible name matches the visible text. */}
          {/* The link is the 44px touch target; the 3D pill inside is 36px. */}
          <Link href={`/${lang}/app`} className="header-download">
            <span className="btn btn-sky btn-3d btn-header">
              <Download aria-hidden />
              <span className="header-download-full">{t.nav.download}</span>
              <span className="header-download-short">{t.nav.downloadShort}</span>
            </span>
          </Link>
        </div>
      </div>
      <NavLinks items={items} lang={lang} className="mobile-nav" label={t.nav.menu} />
    </header>
  );
}

/** App banner shown above the footer on every portal page. */
function AppBanner({ lang }: { lang: Locale }) {
  const t = site(lang).footer.banner;
  return (
    <section className="app-banner" aria-labelledby="app-banner-title">
      <div className="wrap app-banner-inner">
        <div className="app-banner-text">
          <h2 id="app-banner-title" className="app-banner-title">
            <span>{t.titleTop}</span> <span className="h-accent">{t.titleAccent}</span>
          </h2>
          <p className="muted">{t.lead}</p>
        </div>
        <div className="app-banner-actions">
          <Link href={`/${lang}/app`} className="btn btn-primary">{t.cta}</Link>
          <StoreBadges lang={lang} />
        </div>
      </div>
    </section>
  );
}

const SOCIAL_ICONS: Record<SocialNetwork, typeof InstagramLogo> = {
  instagram: InstagramLogo, tiktok: TiktokLogo, facebook: FacebookLogo, youtube: YoutubeLogo, x: XLogo, linkedin: LinkedinLogo,
};

/** Social icons from src/lib/site/social.ts: only networks with a URL (all six with SOCIAL_PREVIEW=1). */
function SocialLinks({ lang }: { lang: Locale }) {
  const t = site(lang).footer;
  const links = socialLinks(undefined, process.env.SOCIAL_PREVIEW === '1');
  if (!links.length) return null;
  return (
    <ul className="footer-social" aria-label={t.socialLabel}>
      {links.map(({ network, href }) => {
        const Icon = SOCIAL_ICONS[network];
        return (
          <li key={network}>
            <a href={href} target="_blank" rel="noopener noreferrer" aria-label={t.social[network]}>
              <Icon weight="fill" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export function SiteFooter({ lang }: { lang: Locale }) {
  const t = site(lang);
  return (
    <>
      <AppBanner lang={lang} />
      <footer className="site-footer">
        <div className="wrap">
          {/* Logo with the social icons under it, the four link columns to its right (owner, 20 Oct 2026); stacked on phones. */}
          <div className="footer-main">
          <div className="footer-brand">
            {/* The header's logo at three times its size (56x27 there, 168x81 here). */}
            <Link href={`/${lang}`} className="footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-168.webp" srcSet="/brand/logo-168.webp 1x, /brand/logo-336.webp 2x" alt={t.footer.homeLabel} width={168} height={81} loading="lazy" decoding="async" />
            </Link>
            <SocialLinks lang={lang} />
          </div>
          <nav aria-label={t.footer.navLabel} className="footer-grid">
            {footerColumns(lang).map((col) => (
              <section key={col.key} aria-labelledby={`footer-${col.key}`}>
                <h2 id={`footer-${col.key}`}>{t.footer.columns[col.key]}</h2>
                <ul>
                  {col.items.map((item) => (
                    <li key={item.key}>
                      {item.links.map((link, i) => (
                        <span key={link.key}>
                          {i > 0 ? <span aria-hidden> &amp; </span> : null}
                          <Link href={link.href}>{t.footer.links[link.key]}</Link>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </nav>
          </div>
          <div className="footer-bottom">
            <p className="small subtle">© {new Date().getFullYear()} REAL4LIFE LTD · {t.footer.company}</p>
            <CookieSettingsButton label={t.consent.settings} />
            <LangSwitch lang={lang} label={t.language} />
          </div>
        </div>
      </footer>
    </>
  );
}
