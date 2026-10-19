'use client';
/** "Cookie settings": reopens the cookie banner (SiteAnalytics) so the visitor can change the choice. */
import { OPEN_CONSENT_EVENT } from './SiteAnalytics';

export default function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className ?? 'cookie-settings'} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>
      {label}
    </button>
  );
}
