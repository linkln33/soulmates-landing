import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import TarotNav from '@/components/site/TarotNav';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import { TarotDaily } from '@/components/tools/TarotTools';
import { TarotCredit } from '@/components/tools/TarotCard';

type Props = PageProps<'/[lang]/tarot'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return pageMeta(lang, '/tarot', t.metaTitle, t.metaDescription);
}

export default async function TarotHub({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).tarot;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.title} lead={t.lead} art="tarot" tile="tarot">
        <TarotNav lang={lang} current="daily" />
      </ToolHeader>
      <div className="grid-2">
        <TarotDaily lang={lang} />
        <div className="stack">
          <AboutBox title={t.aboutTitle} items={t.about} />
          <TarotCredit lang={lang} />
        </div>
      </div>
    </div>
  );
}
