/**
 * Where "get the app" goes (owner, 11 Nov 2026: no separate /app page; Download downloads the app).
 * NEXT_PUBLIC_APP_DOWNLOAD_URL = the APK's address. Unset (until the launch is decided), every link
 * goes to the home page's download section instead, which then shows the "coming soon" badges.
 */
import type { Locale } from '@/i18n/config';

/**
 * The Android APK on Google Drive (owner, 11 Nov 2026: SoulmatesQuest-vc70.apk, 62.9 MB), as a direct download.
 * `confirm=t` skips Drive's "can't scan this file for viruses" page, which otherwise needs a second tap.
 */
export const DRIVE_APK_URL = 'https://drive.usercontent.google.com/download?id=1NVEpA_hbUdaUCy1BievLBEssGR3kpOzW&export=download&confirm=t';
export const APP_DOWNLOAD_URL = process.env.NEXT_PUBLIC_APP_DOWNLOAD_URL || DRIVE_APK_URL;

/** The home hero's store badges (owner, 11 Nov 2026: no separate covers section). */
export const appSectionHref = (lang: Locale) => `/${lang}#download`;

/** A direct download when the APK address is set, else the download section. */
export const appDownloadHref = (lang: Locale) => APP_DOWNLOAD_URL || appSectionHref(lang);
