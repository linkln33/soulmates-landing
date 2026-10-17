import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { app, site } from '@/i18n';
import { TAROT_GROUPS, cardSlug, tarotCard, tarotCardsIn, tarotImage } from '@/content/tarot';
import { pageMeta } from '@/lib/site/meta';
import TarotNav from '@/components/site/TarotNav';
import { ToolHeader } from '@/components/site/ToolPage';
import { TarotCredit } from '@/components/tools/TarotCard';

type Props = PageProps<'/[lang]/tarot/cards'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return pageMeta(lang, '/tarot/cards', t.libraryMetaTitle, t.libraryMetaDescription);
}

export default async function CardLibrary({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  const a = app(lang).tarotReading;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.libraryTitle} lead={a.library.intro} art="tarot" tile="tarot" crumbs={[{ href: `/${lang}/tarot`, label: t.title }]}>
        <TarotNav lang={lang} current="cards" />
      </ToolHeader>
      <div className="stack-lg">
        {TAROT_GROUPS.map((group) => (
          <section key={group} className="stack" aria-labelledby={`g-${group}`}>
            <h2 id={`g-${group}`} className="title">{a.library.groups[group]}</h2>
            <ul className="card-library" style={{ listStyle: 'none' }}>
              {tarotCardsIn(group).map((key) => {
                const card = tarotCard(key, lang);
                if (!card) return null;
                return (
                  <li key={key}>
                    <Link href={`/${lang}/tarot/cards/${cardSlug(key)}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={tarotImage(key)} alt="" width={540} height={810} loading="lazy" decoding="async" />
                      <span>{card.text.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <TarotCredit lang={lang} />
      </div>
    </div>
  );
}
