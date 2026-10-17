import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/i18n/config';
import { app, fmt, site } from '@/i18n';
import { TAROT_KEYS, cardKeyFromSlug, cardSlug, isTarotKey, tarotCard, tarotImage } from '@/content/tarot';
import { pageMeta } from '@/lib/site/meta';
import PatternCard from '@/components/site/PatternCard';
import TarotNav from '@/components/site/TarotNav';
import { TarotCredit, TarotFace } from '@/components/tools/TarotCard';

type Props = PageProps<'/[lang]/tarot/cards/[card]'>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => TAROT_KEYS.map((key) => ({ lang, card: cardSlug(key) })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: l, card: slug } = await params;
  const lang = l as Locale;
  const key = cardKeyFromSlug(slug);
  const card = isTarotKey(key) ? tarotCard(key, lang) : null;
  if (!card) return {};
  const t = site(lang).tarot;
  return pageMeta(
    lang,
    `/tarot/cards/${slug}`,
    fmt(t.cardMetaTitle, { card: card.text.name }),
    fmt(t.cardMetaDescription, { card: card.text.name, keywords: card.text.keywords.join(', ') }),
    tarotImage(key),
  );
}

export default async function CardPage({ params }: Props) {
  const { lang: l, card: slug } = await params;
  const lang = l as Locale;
  const key = cardKeyFromSlug(slug);
  const card = isTarotKey(key) ? tarotCard(key, lang) : null;
  if (!card) notFound();
  const t = site(lang).tarot;
  const a = app(lang).tarotReading;
  const i = TAROT_KEYS.indexOf(key);
  const prev = TAROT_KEYS[(i + TAROT_KEYS.length - 1) % TAROT_KEYS.length];
  const next = TAROT_KEYS[(i + 1) % TAROT_KEYS.length];
  return (
    <div className="wrap page">
      <nav aria-label="Breadcrumb" className="small muted" style={{ marginBottom: 12 }}>
        <Link href={`/${lang}`}>{site(lang).nav.home}</Link> / <Link href={`/${lang}/tarot`}>{t.title}</Link> /{' '}
        <Link href={`/${lang}/tarot/cards`}>{t.library}</Link>
      </nav>
      <article className="stack-lg">
        <div className="tarot-result" style={{ gridTemplateColumns: 'minmax(0, 300px) 1fr' }}>
          <TarotFace cardKey={key} name={card.text.name} priority width={300} />
          <div className="stack">
            <p className="eyebrow">{a.library.groups[card.group]}</p>
            <h1 className="display">{card.text.name}</h1>
            <ul className="keywords" aria-label={a.keywords}>
              {card.text.keywords.map((k) => <li key={k}>{k}</li>)}
            </ul>
            <div>
              <h2 className="heading">{a.imagery}</h2>
              <p className="muted" style={{ marginTop: 4 }}>{card.text.imagery}</p>
            </div>
          </div>
        </div>
        <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <PatternCard tint="teal" as="section">
            <h2 className="heading">{t.meaningUpright}</h2>
            <p style={{ marginTop: 6 }}>{card.text.upright}</p>
          </PatternCard>
          <PatternCard tint="pink" as="section">
            <h2 className="heading">{t.meaningReversed}</h2>
            <p style={{ marginTop: 6 }}>{card.text.reversed}</p>
          </PatternCard>
        </div>
        <PatternCard tint="plain" motif="lotus" as="section">
          <dl className="stack">
            <div><dt className="heading">{a.love}</dt><dd className="muted">{card.text.love}</dd></div>
            <div><dt className="heading">{a.work}</dt><dd className="muted">{card.text.work}</dd></div>
            <div><dt className="heading">{a.advice}</dt><dd><strong>{card.text.advice}</strong></dd></div>
          </dl>
        </PatternCard>
        <nav className="row" style={{ justifyContent: 'space-between' }} aria-label={t.library}>
          <Link className="btn btn-secondary" href={`/${lang}/tarot/cards/${cardSlug(prev)}`} rel="prev">
            ← {tarotCard(prev, lang)?.text.name}
          </Link>
          <Link className="btn btn-secondary" href={`/${lang}/tarot/cards/${cardSlug(next)}`} rel="next">
            {tarotCard(next, lang)?.text.name} →
          </Link>
        </nav>
        <TarotNav lang={lang} current="cards" />
        <TarotCredit lang={lang} />
      </article>
    </div>
  );
}
