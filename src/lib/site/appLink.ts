/**
 * Where "get the app" goes (owner, 11 Nov 2026: no separate /app page; Download downloads the app).
 * NEXT_PUBLIC_APP_DOWNLOAD_URL = the APK's address. Unset (until the launch is decided), every link
 * goes to the home page's download section instead, which then shows the "coming soon" badges.
 */
import type { Locale } from '@/i18n/config';

export const APP_DOWNLOAD_URL = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || '';

/** The home hero's store badges (owner, 11 Nov 2026: no separate covers section). */
export const appSectionHref = (lang: Locale) => `/${lang}#download`;

/** A direct download when the APK address is set, else the download section. */
export const appDownloadHref = (lang: Locale) => APP_DOWNLOAD_URL || appSectionHref(lang);
