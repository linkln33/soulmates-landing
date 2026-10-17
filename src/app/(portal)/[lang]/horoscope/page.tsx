import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import SignGrid from '@/components/site/SignGrid';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';

type Props = PageProps<'/[lang]/horoscope'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).horoscope;
  return pageMeta(lang, '/horoscope', t.metaTitle, t.metaDescription);
}

export default async function HoroscopeIndex({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).horoscope;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.title} lead={t.lead} art="horoscope-wheel" tile="horoscope" />
      <div className="stack-lg">
        <section aria-labelledby="choose-sign" className="stack">
          <h2 id="choose-sign" className="heading">{t.chooseSign}</h2>
          <SignGrid lang={lang} />
        </section>
        <AboutBox title={t.aboutTitle} items={t.about} />
      </div>
    </div>
  );
}
