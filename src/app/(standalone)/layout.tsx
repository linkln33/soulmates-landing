/**
 * Root layout for pages outside the localised portal: the friends' quiz
 * (/quiz/…, language from ?lang or the browser) and the draft legal pages.
 * Same fonts, tokens and theme as the portal.
 */
import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import { SITE_URL } from '@/lib/site/config';
import { TOKENS_CSS } from '@/lib/design/tokens';
import { THEME_SCRIPT } from '@/lib/design/theme';
import { inter } from '@/lib/design/font';


export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'SoulMates Quest',
  icons: { icon: [{ url: '/brand/icon-32.png', sizes: '32x32', type: 'image/png' }, { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' }], apple: '/brand/icon-192.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFFFF' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1426' },
  ],
};

export default function StandaloneLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: TOKENS_CSS }} />
      </head>
      <body className={inter.variable}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
