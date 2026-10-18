/**
 * Inter, self-hosted: one variable WOFF2 (weights 400–800, the range the
 * site uses) subset to Latin and Cyrillic from the official Inter 4.1 release (src/fonts, SIL OFL 1.1,
 * Inter-OFL.txt). Builds never fetch fonts from the network. next/font adds
 * the preload and fallback metrics that keep text from shifting on swap.
 */
import localFont from 'next/font/local';

export const inter = localFont({
  src: '../../fonts/InterVariable-latin-cyrillic.woff2',
  variable: '--font-inter',
  weight: '400 800',
  style: 'normal',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
});
