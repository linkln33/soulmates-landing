import type { ReactNode } from 'react';
import CardPattern from './CardPattern';

/** A simple card with a heading and text, for not-found / paused / error states. */
export function QuizNotice({
  title,
  children,
  eyebrow,
}: {
  title: string;
  children: ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="lx-card" aria-labelledby="lx-notice-title">
      <div className="lx-card-head">
        <span className="lx-eyebrow">{eyebrow ?? ''}</span>
        <CardPattern />
      </div>
      <div className="lx-card-body">
        <h1 id="lx-notice-title" className="lx-title">{title}</h1>
        {children}
      </div>
    </section>
  );
}
