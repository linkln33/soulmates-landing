/** The twelve signs with their dates, each linking to its horoscope page. */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { app, dates } from '@/i18n';
import { SIGN_FACTS, SIGN_KEYS } from '@/content/signs';
import { SignGlyph } from './Bits';

export default function SignGrid({ lang, current }: { lang: Locale; current?: string }) {
  const a = app(lang);
  const d = dates(lang);
  return (
    <ul className="sign-grid" style={{ listStyle: 'none' }}>
      {SIGN_KEYS.map((sign) => (
        <li key={sign} style={{ display: 'flex' }}>
          <Link href={`/${lang}/horoscope/${sign}`} className="sign-cell" style={{ flex: 1 }} aria-current={sign === current ? 'page' : undefined}>
            <SignGlyph sign={sign} />
            <span style={{ fontWeight: 600 }}>{a.signs[sign]}</span>
            <span className="dates">{d.dayMonth(SIGN_FACTS[sign].from)} – {d.dayMonth(SIGN_FACTS[sign].to)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

