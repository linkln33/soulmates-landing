/** Shared server-rendered parts of a tool page: header with artwork, and the explanatory box. */
import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import PatternCard, { type CardMotif, type CardTint } from './PatternCard';

export function ToolHeader({
  lang, title, lead, art, tile, visual, crumbs = [], children,
}: {
  lang: Locale;
  title: string;
  lead: string;
  art?: string;
  tile?: string;
  /** Shown instead of an illustration (e.g. a sign medallion). */
  visual?: ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: ReactNode;
}) {
  const t = site(lang);
  return (
    <header className="stack" style={{ marginBottom: 24 }}>
      <nav aria-label="Breadcrumb" className="small muted">
        <Link href={`/${lang}`}>{t.nav.home}</Link>
        {crumbs.map((c) => (
          <span key={c.href}> / <Link href={c.href}>{c.label}</Link></span>
        ))}
      </nav>
      <div className="row" style={{ alignItems: 'center', gap: 20, flexWrap: 'nowrap' }}>
        <div className="stack" style={{ gap: 10, flex: 1 }}>
          <h1 className="display">{title}</h1>
          <p className="lead">{lead}</p>
        </div>
        {art ? (
          <div className="tile-art tool-art" style={{ background: `var(--tile-${tile})`, borderRadius: 22, width: 168, height: 128, flexShrink: 0 }} aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/app-content/illustrations/${art}.svg`} alt="" width={200} height={150} />
          </div>
        ) : visual ?? null}
      </div>
      {children}
    </header>
  );
}

export function AboutBox({ title, items, tint = 'amber', motif = 'feather' }: { title: string; items: readonly string[]; tint?: CardTint; motif?: CardMotif }) {
  return (
    <PatternCard tint={tint} motif={motif} as="aside">
      <div className="stack prose">
        <h2 className="heading">{title}</h2>
        {items.map((p) => <p key={p} className="small muted">{p}</p>)}
      </div>
    </PatternCard>
  );
}
