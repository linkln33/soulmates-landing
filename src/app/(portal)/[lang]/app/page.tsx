import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import AppLanding from '@/components/app-page/AppLanding';

type Props = PageProps<'/[lang]/app'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).app;
  return pageMeta(lang, '/app', t.metaTitle, t.metaDescription);
}

/** The app page (owner, 11 Nov 2026): wide, image-led, GSAP + the HyperFrames hero loop. */
export default async function AppPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  return <AppLanding lang={lang} t={site(lang).appV2} />;
}
