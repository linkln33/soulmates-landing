/**
 * The invitation landing page (/{lang}/r/<code>). The server only normalises the code: a
 * malformed one renders the neutral invalid view with no API call; a well-formed one renders
 * the code, Copy, "Open in the app", the Android download, the manual fallback and the about
 * card at once, nameless. The visitor's browser then checks the code (ReferralView).
 * No rewards, no promise of admission or matches.
 */
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { appDownloadHref } from '@/lib/site/appLink';
import PatternCard from '@/components/site/PatternCard';
import ReferralView from './ReferralView';

export default function ReferralPage({ lang, code }: { lang: Locale; code: string | null }) {
  const s = site(lang);
  const t = s.referral;

  const about = (
    <PatternCard tint="violet" as="aside" aria-label={t.aboutTitle}>
      <div className="stack prose">
        <h2 className="heading">{t.aboutTitle}</h2>
        <p className="small muted">{t.about}</p>
        <p className="small muted">{s.home.journey.consent}</p>
        <p className="small muted">{s.appV2.adults}</p>
      </div>
    </PatternCard>
  );

  return <ReferralView code={code} t={t} downloadHref={appDownloadHref(lang)} about={about} />;
}
