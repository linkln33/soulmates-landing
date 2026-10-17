/**
 * A tarot card face from our own deck (synced from the app) and its meaning.
 * Reversed cards are shown turned over, as in the app's TarotCardFace.
 */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { app, site } from '@/i18n';
import { cardSlug, tarotImage, type TarotCardView, type TarotOrientation } from '@/content/tarotKeys';

export function TarotFace({
  cardKey, name, orientation = 'upright', priority = false, width = 260,
}: { cardKey: string; name: string; orientation?: TarotOrientation; priority?: boolean; width?: number }) {
  return (
    <div className={`tarot-face${orientation === 'reversed' ? ' reversed' : ''}`} style={{ maxWidth: width }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={tarotImage(cardKey)} alt={name} width={540} height={810} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </div>
  );
}

/** Name, orientation, keywords and the meaning that applies, plus love/work/advice. */
export function TarotMeaning({
  lang, card, orientation, heading = 'h2', showLink = true,
}: { lang: Locale; card: TarotCardView; orientation: TarotOrientation; heading?: 'h2' | 'h3'; showLink?: boolean }) {
  const a = app(lang).tarotReading;
  const H = heading;
  return (
    <div className="stack" style={{ gap: 12 }}>
      <div className="row">
        <H className="title" style={{ marginRight: 'auto' }}>{card.text.name}</H>
        <span className={`orientation${orientation === 'reversed' ? ' reversed' : ''}`}>
          {orientation === 'reversed' ? a.reversed : a.upright}
        </span>
      </div>
      <ul className="keywords" aria-label={a.keywords}>
        {card.text.keywords.map((k) => <li key={k}>{k}</li>)}
      </ul>
      <p>{orientation === 'reversed' ? card.text.reversed : card.text.upright}</p>
      <dl className="stack" style={{ gap: 10 }}>
        <div><dt className="small subtle">{a.love}</dt><dd>{card.text.love}</dd></div>
        <div><dt className="small subtle">{a.work}</dt><dd>{card.text.work}</dd></div>
        <div><dt className="small subtle">{a.advice}</dt><dd><strong>{card.text.advice}</strong></dd></div>
      </dl>
      {showLink ? (
        <p className="small">
          <Link href={`/${lang}/tarot/cards/${cardSlug(card.key)}`}>{card.text.name} →</Link>
        </p>
      ) : null}
    </div>
  );
}

export function TarotCredit({ lang }: { lang: Locale }) {
  return <p className="small subtle">{app(lang).tarotReading.artCredit} {site(lang).reflection}</p>;
}
