/** Links between the tarot readings and the card library. */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';

export type TarotSection = 'daily' | 'one' | 'three' | 'cards';

export default function TarotNav({ lang, current }: { lang: Locale; current: TarotSection }) {
  const t = site(lang).tarot;
  const items: { key: TarotSection; href: string; label: string }[] = [
    { key: 'daily', href: `/${lang}/tarot`, label: t.dailyTitle },
    { key: 'one', href: `/${lang}/tarot/one-card`, label: t.oneTitle },
    { key: 'three', href: `/${lang}/tarot/three-cards`, label: t.threeTitle },
    { key: 'cards', href: `/${lang}/tarot/cards`, label: t.library },
  ];
  return (
    <nav className="chips" aria-label={t.readings}>
      {items.map((i) => (
        <Link key={i.key} href={i.href} className="chip" aria-current={i.key === current ? 'page' : undefined}>{i.label}</Link>
      ))}
    </nav>
  );
}
