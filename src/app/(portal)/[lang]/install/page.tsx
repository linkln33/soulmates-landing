import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import { APK_CERT_SHA256, appDownloadHref } from '@/lib/site/appLink';

type Props = PageProps<'/[lang]/install'>;

/**
 * Android install help for the APK from this website (launch step 1, 13 Nov 2026): download,
 * "Install unknown apps", the Play Protect prompt, opening the app, updating over the existing app,
 * and the signing certificate's SHA-256 fingerprint. /install without a language: src/proxy.ts.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).install;
  return pageMeta(lang, '/install', t.metaTitle, t.metaDescription);
}

export default async function InstallPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const s = site(lang);
  const t = s.install;
  return (
    <div className="wrap page narrow stack-lg">
      <header className="stack">
        <span className="eyebrow">{t.eyebrow}</span>
        <h1 className="display">{t.title}</h1>
        <p className="lead">{t.lead}</p>
        <div className="row">
          <a href={appDownloadHref(lang)} className="btn btn-primary">{t.download}</a>
        </div>
        <p className="small muted">{t.sourceNote}</p>
      </header>

      <section className="stack prose" aria-labelledby="install-steps">
        <h2 id="install-steps" className="title">{t.stepsTitle}</h2>
        <ol style={{ gap: 16 }}>
          {t.steps.map((step) => (
            <li key={step.title}>
              <div className="stack" style={{ gap: 4 }}>
                <h3 className="heading">{step.title}</h3>
                <p className="muted">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="stack prose" aria-labelledby="install-update">
        <h2 id="install-update" className="title">{t.updateTitle}</h2>
        <p className="muted">{t.update}</p>
      </section>

      <section className="stack prose" aria-labelledby="install-check">
        <h2 id="install-check" className="title">{t.checkTitle}</h2>
        <p className="muted">{t.check}</p>
        <p>
          <span className="visually-hidden">{t.fingerprintLabel}: </span>
          <code translate="no" className="small" style={{ fontFamily: 'inherit', fontWeight: 600, letterSpacing: '0.02em', wordBreak: 'break-all', userSelect: 'all' }}>
            {APK_CERT_SHA256}
          </code>
        </p>
        <p className="small muted">{t.checkNote}</p>
      </section>

      <p className="small subtle">{s.appV2.adults}</p>
    </div>
  );
}
