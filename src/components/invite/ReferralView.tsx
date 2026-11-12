'use client';
/**
 * The invitation content. The server renders it nameless at once; then the visitor's browser
 * checks the code (POST {API}/referrals/validate, like the quiz pages, so the API rate-limits
 * each visitor by their own IP):
 *  - valid → "<firstName> invited you…" (or the nameless "You've been invited…");
 *  - 404/400 → the neutral invalid view;
 *  - 429/5xx/timeout/network → stays nameless with a short note.
 */
import { useEffect, useState, type ReactNode } from 'react';
import type { SiteMessages } from '@/i18n/site/en';
import { API_BASE } from '@/lib/site/config';
import { referralDeepLink, validateReferralCode, type ReferralCheck } from '@/lib/site/referral';
import PatternCard from '@/components/site/PatternCard';
import CopyCode from './CopyCode';

type State = { status: 'checking' } | ReferralCheck;

const fill = (template: string, key: string, value: string) => template.split(`{${key}}`).join(value);

export default function ReferralView({
  code, t, downloadHref, about, qr,
}: {
  /** Normalised code, or null when malformed (rendered invalid, never sent to the API). */
  code: string | null;
  t: SiteMessages['referral'];
  downloadHref: string;
  about: ReactNode;
  /** Server-rendered QR of the invitation link (ReferralQr), or null. */
  qr: ReactNode;
}) {
  const [state, setState] = useState<State>(code ? { status: 'checking' } : { status: 'invalid' });

  useEffect(() => {
    if (!code) return;
    let active = true;
    validateReferralCode(code, { apiBase: API_BASE }).then((result) => {
      if (active) setState(result);
    });
    return () => {
      active = false;
    };
  }, [code]);

  if (state.status === 'invalid' || !code) {
    return (
      <div className="wrap page narrow stack-lg">
        <header className="stack">
          <h1 className="display">{t.invalidTitle}</h1>
          <p className="lead">{t.invalidLead}</p>
          <div className="row">
            <a href={downloadHref} className="btn btn-primary">{t.download}</a>
          </div>
        </header>
        {about}
      </div>
    );
  }

  const title =
    state.status === 'valid'
      ? state.firstName
        ? fill(t.titleNamed, 'name', state.firstName)
        : t.titleAnonymous
      : t.titleUnavailable;
  const lead = state.status === 'unavailable' ? t.leadUnavailable : t.leadValid;

  return (
    <div className="wrap page narrow stack-lg">
      <header className="stack" aria-busy={state.status === 'checking'}>
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="display">{title}</h1>
        <p className="lead">{lead}</p>
      </header>

      <PatternCard tint="pink" as="section" aria-label={t.codeLabel}>
        <div className="stack">
          <CopyCode code={code} label={t.codeLabel} copy={t.copy} copied={t.copied} copyFailed={t.copyFailed} />
          <div className="row">
            <a href={referralDeepLink(code)} className="btn btn-primary">{t.openApp}</a>
            <a href={downloadHref} className="btn btn-secondary">{t.download}</a>
          </div>
          {qr}
        </div>
      </PatternCard>

      <section className="stack prose" aria-labelledby="referral-manual">
        <h2 id="referral-manual" className="heading">{t.manualTitle}</h2>
        <p>{fill(t.manual, 'code', code.toUpperCase())}</p>
        <ul className="small muted">
          <li>{t.manualEmail}</li>
          <li>{t.manualGoogle}</li>
        </ul>
      </section>

      {about}
    </div>
  );
}
