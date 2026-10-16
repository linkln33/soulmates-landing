import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import '../../quiz.css';
import QuizShell, { QuizNotice } from '@/components/quiz/QuizShell';
import DeleteAnswers from '@/components/quiz/DeleteAnswers';
import { messages, resolveLang, type Lang } from '@/lib/quiz/messages';

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

async function langFor(sp: Record<string, string | string[] | undefined>): Promise<Lang> {
  const h = await headers();
  return resolveLang(sp.lang, h.get('accept-language'));
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const lang = await langFor(await searchParams);
  return {
    title: messages(lang).metaDelete,
    robots: { index: false, follow: false },
    // The token is a secret: never send it to other sites as a referrer.
    referrer: 'no-referrer',
  };
}

export default async function DeleteAnswersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const lang = await langFor(sp);
  const m = messages(lang);
  const token = (first(sp.t) ?? '').trim();

  return (
    <QuizShell lang={lang} path="/quiz/answer/delete" query={token ? { t: token } : {}}>
      {token ? (
        <DeleteAnswers token={token} lang={lang} />
      ) : (
        <QuizNotice title={m.deleteTitle}>
          <p className="lx-lead">{m.deleteNoToken}</p>
          <div className="lx-actions">
            <Link href="/" className="lx-btn lx-btn-primary">{m.goHome}</Link>
          </div>
        </QuizNotice>
      )}
    </QuizShell>
  );
}
