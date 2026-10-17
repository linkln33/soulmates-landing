import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import TarotNav from '@/components/site/TarotNav';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import { TarotDraw } from '@/components/tools/TarotTools';

type Props = PageProps<'/[lang]/tarot/three-cards'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return pageMeta(lang, '/tarot/three-cards', t.threeMetaTitle, t.threeMetaDescription);
}

export default async function ThreeCards({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.threeTitle} lead={t.threeLead} art="tarot" tile="tarot" crumbs={[{ href: `/${lang}/tarot`, label: t.title }]}>
        <TarotNav lang={lang} current="three" />
      </ToolHeader>
      <div className="stack-lg">
        <TarotDraw lang={lang} count={3} />
        <AboutBox title={t.aboutTitle} items={t.about} />
      </div>
    </div>
  );
}
