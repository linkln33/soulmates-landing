import type { ReactNode } from 'react';
import Stars from '@/components/landing/Stars';
import SiteNav from '@/components/landing/SiteNav';
import SiteFooter from '@/components/landing/SiteFooter';

/** Placeholder for information that must be supplied before publication. */
export function Missing({ children }: { children: ReactNode }) {
  return <span className="missing">[MISSING: {children}]</span>;
}

/** Shell for draft legal pages: visible draft banner, nav and footer. */
export default function LegalDraft({ title, children }: { title: string; children: ReactNode }) {
  return (
    <>
      <div className="bgo">
        <div className="orb o1" />
      </div>
      <Stars />
      <SiteNav />
      <main className="doc">
        <div className="draft-banner" role="note">
          Draft — not yet in effect. This text has not been reviewed by a lawyer and contains placeholders
          marked [MISSING].
        </div>
        <h1>{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
