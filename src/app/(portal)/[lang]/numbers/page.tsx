import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import { AboutBox, ToolHeader } from '@/components/site/ToolPage';
import NumbersTool from '@/components/tools/NumbersTool';

type Props = PageProps<'/[lang]/numbers'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).numbers;
  return pageMeta(lang, '/numbers', t.metaTitle, t.metaDescription);
}

export default async function NumbersPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).numbers;
  return (
    <div className="wrap page">
      <ToolHeader lang={lang} title={t.title} lead={t.lead} art="numbers" tile="numbers" />
      <div className="grid-2">
        <NumbersTool lang={lang} />
        <AboutBox title={t.aboutTitle} items={t.about} tint="violet" motif="constellation" />
      </div>
    </div>
  );
}
