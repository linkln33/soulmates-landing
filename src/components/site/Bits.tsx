/** Small shared pieces: app invitation, loading and error states, sign glyph. */
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { SIGN_FACTS, type SignKey } from '@/content/signs';
import PatternCard from './PatternCard';

export type InviteTool = 'horoscope' | 'tarot' | 'numbers' | 'moon';

/** The one contextual invitation, shown after a reading has been delivered. */
export function AppInvite({ lang, tool }: { lang: Locale; tool: InviteTool }) {
  const t = site(lang).invite;
  return (
    <PatternCard tint="pink" motif="sprig" as="aside" aria-label={t.title}>
      <div className="invite">
        <h2 className="heading">{t.title}</h2>
        <p className="small muted">{t[tool]}</p>
        <Link href={`/${lang}/app`} className="btn btn-secondary">{t.cta}</Link>
      </div>
    </PatternCard>
  );
}

export function Loading({ lang, lines = 3 }: { lang: Locale; lines?: number }) {
  return (
    <div className="stack" role="status" aria-live="polite">
      <span className="visually-hidden">{site(lang).states.loading}</span>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className="skeleton" style={{ height: i === 0 ? 26 : 16, width: i === 0 ? '55%' : `${92 - i * 9}%` }} aria-hidden />
      ))}
    </div>
  );
}

export function ErrorState({ lang, kind, onRetry }: { lang: Locale; kind: 'rate_limited' | 'error' | 'network' | 'invalid'; onRetry?: () => void }) {
  const t = site(lang).states;
  const body = kind === 'rate_limited' ? t.rateLimited : kind === 'invalid' ? t.invalid : t.errorBody;
  return (
    <div className="state state-error" role="alert">
      <p className="heading">{t.errorTitle}</p>
      <p className="small muted">{body}</p>
      {onRetry ? <button type="button" className="btn btn-secondary" onClick={onRetry}>{t.retry}</button> : null}
    </div>
  );
}

export function SignGlyph({ sign, className = '' }: { sign: SignKey; className?: string }) {
  return <span className={`sign-glyph ${className}`} aria-hidden>{SIGN_FACTS[sign].glyph}</span>;
}
