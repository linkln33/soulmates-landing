/**
 * App Store and Google Play badges in their "coming soon" state. The app has
 * no public listing yet, so these are not links; when listings exist, turn
 * each into a link to its store page.
 */
import { AppleLogo, GooglePlayLogo } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';

export default function StoreBadges({ lang, className = '' }: { lang: Locale; className?: string }) {
  const t = site(lang).stores;
  const stores = [
    { name: t.appStore, Icon: AppleLogo },
    { name: t.googlePlay, Icon: GooglePlayLogo },
  ];
  return (
    <ul className={`store-badges ${className}`} aria-label={t.label}>
      {stores.map(({ name, Icon }) => (
        <li key={name} className="store-badge" aria-label={`${name} — ${t.soon}`}>
          <Icon weight="fill" aria-hidden />
          <span aria-hidden><small>{t.soon}</small><b>{name}</b></span>
        </li>
      ))}
    </ul>
  );
}
