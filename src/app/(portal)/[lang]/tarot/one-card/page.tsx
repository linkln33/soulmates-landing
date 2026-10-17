import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import TarotNav from '@/components/site/TarotNav';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import { TarotDraw } from '@/components/tools/TarotTools';

type Props = PageProps<'/[lang]/tarot/one-card'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return pageMeta(lang, '/tarot/one-card', t.oneMetaTitle, t.oneMetaDescription);
}

export default async function OneCard({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.oneTitle} lead={t.oneLead} art="tarot" tile="tarot" crumbs={[{ href: `/${lang}/tarot`, label: t.title }]}>
        <TarotNav lang={lang} current="one" />
      </ToolHeader>
      <div className="stack-lg">
        <TarotDraw lang={lang} count={1} />
        <AboutBox title={t.aboutTitle} items={t.about} />
      </div>
    </div>
  );
}
