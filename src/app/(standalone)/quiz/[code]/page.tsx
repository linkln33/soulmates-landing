import type { Metadata } from 'next';
import { headers } from 'next/headers';
import '../quiz.css';
import QuizShell from '@/components/quiz/QuizShell';
import QuizLoader from '@/components/quiz/QuizLoader';
import { messages, resolveLang, type Lang } from '@/lib/quiz/messages';

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function langFor(searchParams: Props['searchParams']): Promise<Lang> {
  const [sp, h] = await Promise.all([searchParams, headers()]);
  return resolveLang(sp.lang, h.get('accept-language'));
}

// No API calls on the server: the quiz loads in the visitor's browser, so the
// API's rate limits apply to each visitor's own IP, not to this server.
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const m = messages(await langFor(searchParams));
  return {
    title: m.metaTitle,
    description: m.metaDescription,
    robots: { index: false, follow: false },
    openGraph: { title: m.metaTitle, description: m.metaDescription, type: 'website', images: [{ url: '/logo.png', width: 1024, height: 1024 }] },
    twitter: { card: 'summary', title: m.metaTitle, description: m.metaDescription, images: ['/logo.png'] },
  };
}

export default async function QuizPage({ params, searchParams }: Props) {
  const [{ code }, lang] = await Promise.all([params, langFor(searchParams)]);
  return (
    <QuizShell lang={lang} path={`/quiz/${encodeURIComponent(code)}`}>
      <QuizLoader code={code} lang={lang} />
    </QuizShell>
  );
}
