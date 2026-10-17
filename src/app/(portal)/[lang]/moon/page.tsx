import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import MoonTool from '@/components/tools/MoonTool';

type Props = PageProps<'/[lang]/moon'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).moon;
  return pageMeta(lang, '/moon', t.metaTitle, t.metaDescription);
}

export default async function MoonPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).moon;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.title} lead={t.lead} art="moon-phases" tile="moon-calendar" />
      <div className="grid-2">
        <MoonTool lang={lang} />
        <AboutBox title={t.aboutTitle} items={t.about} tint="teal" motif="palm" />
      </div>
    </div>
  );
}
