/**
 * Footer navigation (owner's layout, 18 Oct 2026): four columns of four
 * items. Every href is an existing localised route or an anchor that exists
 * on its destination page (checked by footer.test.ts); never "#". The
 * mailbox is not verified yet, so Contact points to /{lang}/about#contact.
 */
import type { Locale } from '../../i18n/config.ts';

export type FooterLinkKey =
  | 'readings' | 'horoscope' | 'tarot' | 'numerology' | 'moon'
  | 'app' | 'matching' | 'compass' | 'pilot'
  | 'about' | 'safety' | 'deleteAccount' | 'contact'
  | 'privacy' | 'terms' | 'communityRules' | 'cookies';

export type FooterColumnKey = 'readings' | 'app' | 'support' | 'legal';

/** One footer item: usually one link; "Numerology & Moon" is two links in one item. */
export type FooterItem = { key: string; links: { key: FooterLinkKey; href: string }[] };

export function footerColumns(lang: Locale): { key: FooterColumnKey; items: FooterItem[] }[] {
  const l = (key: FooterLinkKey, path: string) => ({ key, href: `/${lang}${path}` });
  const one = (key: FooterLinkKey, path: string): FooterItem => ({ key, links: [l(key, path)] });
  return [
    {
      key: 'readings',
      items: [
        one('readings', '#tools'),
        one('horoscope', '/horoscope'),
        one('tarot', '/tarot'),
        { key: 'numerology-moon', links: [l('numerology', '/numbers'), l('moon', '/moon')] },
      ],
    },
    {
      key: 'app',
      items: [
        one('app', '/app'),
        one('matching', '/app#how-matching-works'),
        one('compass', '/app#daily-compass'),
        one('pilot', '/app#limited-pilot'),
      ],
    },
    {
      key: 'support',
      items: [
        one('about', '/about'),
        one('safety', '/safety'),
        one('deleteAccount', '/delete-account'),
        one('contact', '/about#contact'),
      ],
    },
    {
      key: 'legal',
      items: [
        one('privacy', '/privacy'),
        one('terms', '/terms'),
        one('communityRules', '/safety#community-rules'),
        one('cookies', '/privacy#cookies-local-storage'),
      ],
    },
  ];
}
