/** Renders the small Markdown subset of src/lib/site/markdown.ts (server component). */
import Link from 'next/link';
import type { ReactNode } from 'react';
import { parseMarkdown, type Inline } from '@/lib/site/markdown';

function inline(parts: Inline[]): ReactNode[] {
  return parts.map((p, i) => {
    if (p.kind === 'bold') return <strong key={i}>{p.text}</strong>;
    if (p.kind === 'link') {
      return p.href.startsWith('/') ? <Link key={i} href={p.href}>{p.text}</Link> : <a key={i} href={p.href}>{p.text}</a>;
    }
    return p.text;
  });
}

export default function Markdown({ source }: { source: string }) {
  return (
    <>
      {parseMarkdown(source).map((b, i) => {
        switch (b.kind) {
          case 'heading': {
            const H = b.level === 1 ? 'h1' : b.level === 2 ? 'h2' : 'h3';
            return <H key={i} id={b.id} className={b.level === 1 ? 'display' : undefined}>{inline(b.text)}</H>;
          }
          case 'paragraph':
            return <p key={i}>{inline(b.text)}</p>;
          case 'list':
            return <ul key={i}>{b.items.map((it, j) => <li key={j}>{inline(it)}</li>)}</ul>;
          case 'table':
            return (
              <div key={i} className="doc-table">
                <table>
                  <thead><tr>{b.head.map((c, j) => <th key={j} scope="col">{inline(c)}</th>)}</tr></thead>
                  <tbody>{b.rows.map((r, j) => <tr key={j}>{r.map((c, k) => <td key={k}>{inline(c)}</td>)}</tr>)}</tbody>
                </table>
              </div>
            );
        }
      })}
    </>
  );
}
