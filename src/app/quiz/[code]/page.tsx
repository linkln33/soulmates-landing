import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { cache } from 'react';
import '../quiz.css';
import QuizShell, { QuizNotice } from '@/components/quiz/QuizShell';
import QuizFlow from '@/components/quiz/QuizFlow';
import { cardStyleOf, loadQuiz } from '@/lib/quiz/api';
import { messages, resolveLang, type Lang } from '@/lib/quiz/messages';

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

// One API read per request, shared by generateMetadata and the page.
const getQuiz = cache(loadQuiz);

async function langFor(searchParams: Props['searchParams']): Promise<Lang> {
  const [sp, h] = await Promise.all([searchParams, headers()]);
  return resolveLang(sp.lang, h.get('accept-language'));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const [{ code }, lang] = await Promise.all([params, langFor(searchParams)]);
  const m = messages(lang);
  const robots = { index: false, follow: false };
  const load = await getQuiz(code);
  if (load.status !== 'ok') return { title: m.metaNotFound, robots };
  const name = load.data.quiz.creatorName;
  const title = m.metaTitle(name);
  const description = m.metaDescription(name);
  return {
    title,
    description,
    robots,
    openGraph: { title, description, type: 'website', images: [{ url: '/logo.png', width: 1024, height: 1024 }] },
    twitter: { card: 'summary', title, description, images: ['/logo.png'] },
  };
}

export default async function QuizPage({ params, searchParams }: Props) {
  const [{ code }, lang] = await Promise.all([params, langFor(searchParams)]);
  const m = messages(lang);
  const path = `/quiz/${encodeURIComponent(code)}`;
  const load = await getQuiz(code);

  if (load.status !== 'ok') {
    const title = load.status === 'not_found' ? m.notFoundTitle : load.status === 'gone' ? m.pausedTitle : m.loadErrorTitle;
    const text = load.status === 'not_found' ? m.notFoundText : load.status === 'gone' ? m.pausedText : m.loadErrorText;
    return (
      <QuizShell lang={lang} path={path}>
        <QuizNotice title={title}>
          <p className="lx-lead" role={load.status === 'error' ? 'alert' : undefined}>{text}</p>
          <div className="lx-actions lx-actions-stack">
            {load.status === 'error' && (
              <Link href={`${path}?lang=${lang}`} className="lx-btn lx-btn-primary">{m.retry}</Link>
            )}
            <Link href="/" className={`lx-btn ${load.status === 'error' ? 'lx-btn-ghost' : 'lx-btn-primary'}`}>{m.goHome}</Link>
          </div>
        </QuizNotice>
      </QuizShell>
    );
  }

  return (
    <QuizShell lang={lang} path={path} cardStyle={cardStyleOf(load.data.quiz.cardStyle)}>
      <QuizFlow code={code} data={load.data} lang={lang} />
    </QuizShell>
  );
}
