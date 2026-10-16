'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { deleteAnswers, type DeleteOutcome } from '@/lib/quiz/api';
import { messages, type Lang } from '@/lib/quiz/messages';
import CardPattern from './CardPattern';

type State = { kind: 'idle' } | { kind: 'deleting' } | DeleteOutcome;

/** Confirm and delete a friend's quiz answers with the one-time token. */
export default function DeleteAnswers({ token, lang }: { token: string; lang: Lang }) {
  const m = messages(lang);
  const [state, setState] = useState<State>({ kind: 'idle' });
  const headingRef = useRef<HTMLHeadingElement>(null);
  const done = state.kind === 'deleted' || state.kind === 'not_found';

  useEffect(() => {
    if (done) headingRef.current?.focus();
  }, [done]);

  async function onDelete() {
    if (state.kind === 'deleting') return;
    setState({ kind: 'deleting' });
    setState(await deleteAnswers(token));
  }

  const title = state.kind === 'deleted' ? m.deleted : state.kind === 'not_found' ? m.deleteNotFound : m.deleteTitle;

  return (
    <section className="lx-card" aria-labelledby="lx-delete-title">
      <div className="lx-card-head">
        <span className="lx-eyebrow" />
        <CardPattern />
      </div>
      <div className="lx-card-body">
        <h1 id="lx-delete-title" ref={headingRef} tabIndex={-1} className="lx-title">{title}</h1>
        {done ? (
          <div className="lx-actions">
            <Link href="/" className="lx-btn lx-btn-primary">{m.goHome}</Link>
          </div>
        ) : (
          <>
            <p className="lx-lead">{m.deleteText}</p>
            {(state.kind === 'rate_limited' || state.kind === 'error') && (
              <div className="lx-error-box" role="alert">
                <p>{state.kind === 'rate_limited' ? m.deleteRate : m.errGeneric}</p>
                {state.kind === 'error' && state.correlationId && <p className="lx-ref">{m.reference(state.correlationId)}</p>}
              </div>
            )}
            <div className="lx-actions">
              <button
                type="button"
                className="lx-btn lx-btn-danger"
                onClick={onDelete}
                disabled={state.kind === 'deleting'}
                aria-busy={state.kind === 'deleting' || undefined}
              >
                {state.kind === 'deleting' ? m.deleting : state.kind === 'idle' ? m.deleteButton : m.retry}
              </button>
            </div>
          </>
        )}
        <p className="lx-visually-hidden" aria-live="polite">{state.kind === 'deleting' ? m.deleting : ''}</p>
      </div>
    </section>
  );
}
