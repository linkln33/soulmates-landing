import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { normalizeReferralCode } from '@/lib/site/referral';
import ReferralPage from '@/components/invite/ReferralPage';

type Props = PageProps<'/[lang]/r/[code]'>;

// No API call on the server: the visitor's browser checks the code (components/invite/ReferralView),
// so the API rate-limits each visitor by their own IP. /r/<code> without a language is redirected here by src/proxy.ts.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = site((await params).lang as Locale).referral;
  // No name in the metadata: link previews never show who sent the invitation.
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: { index: false, follow: false },
    openGraph: { title: t.metaTitle, description: t.metaDescription, type: 'website', images: [{ url: '/app-content/logo.png', width: 1373, height: 655 }] },
  };
}

export default async function Page({ params }: Props) {
  const { lang, code } = await params;
  return <ReferralPage lang={lang as Locale} code={normalizeReferralCode(code)} />;
}
