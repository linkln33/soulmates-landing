/**
 * Root layout for pages outside the localised portal: the friends' quiz
 * (/quiz/…, language from ?lang or the browser) and the draft legal pages.
 * Same fonts, tokens and theme as the portal.
 */
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { SITE_URL } from '@/lib/site/config';
import { THEME_SCRIPT, TOKENS_CSS } from '@/lib/design/tokens';

const inter = Inter({ variable: '--font-inter', subsets: ['latin', 'cyrillic'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: 'SoulMates Quest',
  icons: { icon: [{ url: '/favicon.png', sizes: '256x256', type: 'image/png' }], apple: '/logo.png' },
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
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
