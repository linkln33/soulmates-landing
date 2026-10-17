import type { ReactNode } from 'react';
import { SiteFooter, SiteHeader } from './SiteChrome';

/**
 * The legal pages are drafts with [MISSING] placeholders and must not be
 * published. They render only when LEGAL_DRAFTS=show is set at build time
 * (local review); otherwise /privacy and /terms are 404 and nothing links to
 * them. Remove this gate when the reviewed texts replace the drafts
 * (LEGAL_DRAFT_TODO.md).
 */
export function legalDraftsShown(): boolean {
  return process.env.LEGAL_DRAFTS === 'show';
}

/** Placeholder for information that must be supplied before publication. */
export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">[MISSING: {children}]</span>;
}

/** Shell for draft legal pages (English only while drafts): visible draft banner, header and footer. */
export default function LegalDraft({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader lang="en" />
      <main id="main" className="wrap page narrow doc">
        <div className="draft-banner" role="note">
          Draft — not yet in effect. This text has not been reviewed by a lawyer and contains placeholders
          marked [MISSING].
        </div>
        <h1 className="display">{title}</h1>
        {children}
      </main>
      <SiteFooter lang="en" />
    </>
  );
}
