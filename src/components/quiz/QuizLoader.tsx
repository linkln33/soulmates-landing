'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cardStyleOf, loadQuiz, type QuizLoad } from '@/lib/quiz/api';
import { messages, type Lang } from '@/lib/quiz/messages';
import QuizFlow from './QuizFlow';
import { QuizNotice } from './QuizNotice';

/**
 * Loads the quiz in the browser, so the API rate-limits each visitor by their
 * own IP (not the website server's), then renders the flow or a notice.
 */
export default function QuizLoader({ code, lang }: { code: string; lang: Lang }) {
  const m = messages(lang);
  const [load, setLoad] = useState<QuizLoad | null>(null);

  async function fetchQuiz() {
    setLoad(await loadQuiz(code));
  }

  useEffect(() => {
    let active = true;
    loadQuiz(code).then((result) => {
      if (active) setLoad(result);
    });
    return () => {
      active = false;
    };
  }, [code]);

  if (!load) {
    return (
      <div className="lx-loading" role="status" aria-live="polite">
        <span className="lx-spinner" aria-hidden="true" />
        <span>{m.loading}</span>
      </div>
    );
  }

  if (load.status === 'ok' && load.data.acceptingAnswers === false) {
    return (
      <QuizNotice title={m.answersPausedTitle}>
        <p className="lx-lead">{m.answersPausedText(load.data.quiz.creatorName)}</p>
        <div className="lx-actions lx-actions-stack">
          <Link href="/" className="lx-btn lx-btn-primary">{m.goHome}</Link>
        </div>
      </QuizNotice>
    );
  }

  if (load.status === 'ok') {
    return (
      <div data-style={cardStyleOf(load.data.quiz.cardStyle)}>
        <QuizFlow code={code} data={load.data} lang={lang} />
      </div>
    );
  }

  const title = load.status === 'not_found' ? m.notFoundTitle : load.status === 'gone' ? m.pausedTitle : m.loadErrorTitle;
  const text = load.status === 'not_found' ? m.notFoundText : load.status === 'gone' ? m.pausedText : m.loadErrorText;
  return (
    <QuizNotice title={title}>
      <p className="lx-lead" role={load.status === 'error' ? 'alert' : undefined}>{text}</p>
      <div className="lx-actions lx-actions-stack">
        {load.status === 'error' && (
          <button
            type="button"
            className="lx-btn lx-btn-primary"
            onClick={() => {
              setLoad(null);
              void fetchQuiz();
            }}
          >
            {m.retry}
          </button>
        )}
        <Link href="/" className={`lx-btn ${load.status === 'error' ? 'lx-btn-ghost' : 'lx-btn-primary'}`}>{m.goHome}</Link>
      </div>
    </QuizNotice>
  );
}
