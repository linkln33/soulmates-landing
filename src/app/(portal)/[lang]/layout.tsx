import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../../globals.css';
import StorageSweep from '@/components/site/StorageSweep';
import SiteAnalytics from '@/components/site/SiteAnalytics';
import { LOCALES, isLocale } from '@/i18n/config';
import { site } from '@/i18n';
import { SITE_URL } from '@/lib/site/config';
import { TOKENS_CSS } from '@/lib/design/tokens';
import { THEME_SCRIPT } from '@/lib/design/theme';
import { inter } from '@/lib/design/font';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';


export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<'/[lang]'>): Promise<Metadata> {
  const { lang } = await params;
  const t = isLocale(lang) ? site(lang) : site('en');
  return {
    metadataBase: new URL(SITE_URL),
    applicationName: t.siteName,
    title: { default: t.home.metaTitle, template: `%s — ${t.siteName}` },
    icons: { icon: [{ url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/brand/icon-192.png' },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1426' },
  ],
};

export default async function PortalLayout({ children, params }: LayoutProps<'/[lang]'>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: TOKENS_CSS }} />
      </head>
      <body className={inter.variable}>
        <SiteHeader lang={lang} />
        <main id="main">{children}</main>
        <SiteFooter lang={lang} />
        <StorageSweep />
        <SiteAnalytics />
      </body>
    </html>
  );
}
