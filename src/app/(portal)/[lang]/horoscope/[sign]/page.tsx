import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LOCALES, type Locale } from '@/i18n/config';
import { app, dates, fmt, site } from '@/i18n';
import { SIGN_FACTS, SIGN_KEYS, isSignKey, type SignKey } from '@/content/signs';
import { pageMeta } from '@/lib/site/meta';
import { SignGlyph } from '@/components/site/Bits';
import PatternCard from '@/components/site/PatternCard';
import SignGrid from '@/components/site/SignGrid';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import HoroscopeReading from '@/components/tools/HoroscopeReading';

type Props = PageProps<'/[lang]/horoscope/[sign]'>;

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => SIGN_KEYS.map((sign) => ({ lang, sign })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: l, sign } = await params;
  const lang = l as Locale;
  if (!isSignKey(sign)) return {};
  const t = site(lang).horoscope;
  const name = app(lang).signs[sign];
  return pageMeta(lang, `/horoscope/${sign}`, fmt(t.signMetaTitle, { sign: name }), fmt(t.signMetaDescription, { sign: name }));
}

function SignFactsCard({ lang, sign }: { lang: Locale; sign: SignKey }) {
  const a = app(lang);
  const d = dates(lang);
  const f = SIGN_FACTS[sign];
  const rulers = a.signFacts.rulers as Record<string, string>;
  const ruler = f.traditionalRuler
    ? fmt(a.signFacts.traditionally, { modern: rulers[f.ruler], traditional: rulers[f.traditionalRuler] })
    : rulers[f.ruler];
  return (
    <PatternCard tint="amber" motif="feather" as="aside">
      <div className="stack">
        <h2 className="heading">{fmt(a.horoscope.aboutSign, { sign: a.signs[sign] })}</h2>
        <p className="muted">{fmt(a.signFacts.dates, { from: d.dayMonth(f.from), to: d.dayMonth(f.to) })}</p>
        <dl className="facts">
          <dt>{a.signFacts.element}</dt>
          <dd>{a.signFacts.elements[f.element]}</dd>
          <dt>{a.signFacts.modality}</dt>
          <dd>{a.signFacts.modalities[f.modality]}</dd>
          <dt>{a.signFacts.ruler}</dt>
          <dd>{ruler}</dd>
        </dl>
        <div>
          <p className="heading" style={{ fontSize: 16 }}>{a.moon.mood[sign].title}</p>
          <p className="small muted">{a.moon.mood[sign].body}</p>
        </div>
      </div>
    </PatternCard>
  );
}

export default async function SignHoroscope({ params }: Props) {
  const { lang: l, sign } = await params;
  const lang = l as Locale;
  if (!isSignKey(sign)) notFound();
  const t = site(lang).horoscope;
  const a = app(lang);
  const name = a.signs[sign];
  return (
    <div className="wrap page">
      <ToolHeader
        lang={lang}
        title={name}
        lead={fmt(a.horoscope.readingFor, { sign: name })}
        crumbs={[{ href: `/${lang}/horoscope`, label: t.title }]}
        visual={<div className="medallion" aria-hidden><SignGlyph sign={sign} /></div>}
      />
      <div className="grid-2">
        <HoroscopeReading lang={lang} sign={sign} />
        <div className="stack">
          <SignFactsCard lang={lang} sign={sign} />
          <AboutBox title={t.aboutTitle} items={t.about} tint="plain" motif="lotus" />
        </div>
      </div>
      <section className="stack" style={{ marginTop: 40 }} aria-labelledby="other-signs">
        <h2 id="other-signs" className="heading">{t.otherSigns}</h2>
        <SignGrid lang={lang} current={sign} />
      </section>
    </div>
  );
}
