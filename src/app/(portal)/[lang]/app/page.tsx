import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight, CheckCircle, Clock, Sparkle } from '@phosphor-icons/react/dist/ssr';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import { breadcrumbJsonLd } from '@/lib/site/jsonld';
import StoreBadges from '@/components/site/StoreBadges';
import { AcceptScreen, ChatScreen, HomeScreen, MatchesScreen, Phone } from '@/components/app-page/AppScreens';
import '@/components/app-page/app-page.css';

type Props = PageProps<'/[lang]/app'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).app;
  // The descriptive title carries the brand itself, so it skips the layout's suffix.
  return { ...pageMeta(lang, '/app', t.metaTitle, t.metaDescription), title: { absolute: t.metaTitle } };
}

const STATUS_ICON = { today: CheckCircle, pilot: Sparkle, planned: Clock } as const;

export default async function AppPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).app;
  const nav = site(lang).nav;
  const [before, after] = t.contact.split('{contact}');
  const screens = [HomeScreen, MatchesScreen, AcceptScreen, ChatScreen];
  // Footer links point at these anchors (src/lib/site/footer.ts; checked by footer.test.ts).
  const stepIds = ['daily-compass', 'how-matching-works', 'mutual-acceptance', 'open-connection'];
  const jsonLd = breadcrumbJsonLd([
    { name: nav.home, path: `/${lang}` },
    { name: t.breadcrumb, path: `/${lang}/app` },
  ]);

  return (
    <div className="ap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

      <section className="wrap ap-hero" aria-labelledby="app-title">
        <div className="ap-hero-text">
          <nav aria-label="Breadcrumb" className="small muted">
            <Link href={`/${lang}`}>{nav.home}</Link> / <span aria-current="page">{t.breadcrumb}</span>
          </nav>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1 id="app-title" className="ap-title">{t.title}</h1>
          <p className="lead">{t.lead}</p>
          <dl className="ap-facts">
            {t.facts.map((f, i) => (
              <div key={f.label} className={`ap-fact f-${i}`}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="ap-ctas">
            <Link href={`/${lang}#tools`} className="btn btn-primary btn-3d">{t.ctaReadings}<ArrowRight aria-hidden /></Link>
            <a href="#inside-the-app" className="btn btn-glass btn-3d">{t.ctaHow}<ArrowDown aria-hidden /></a>
          </div>
          <p className="small muted">{t.noDownload}</p>
        </div>
        <figure className="ap-hero-visual">
          <div className="ap-phones">
            <Phone label={t.heroLabel} className="ap-phone-front"><HomeScreen lang={lang} /></Phone>
            <div className="ap-phone-back" aria-hidden><Phone label="" className="ps-decor"><MatchesScreen lang={lang} /></Phone></div>
          </div>
          <figcaption className="ap-badge">{t.recreated}</figcaption>
        </figure>
      </section>

      <section id="inside-the-app" className="wrap ap-section" aria-labelledby="sequence-title">
        <div className="ap-section-head">
          <p className="eyebrow">{t.sequence.eyebrow}</p>
          <h2 id="sequence-title" className="title">{t.sequence.title}</h2>
          <p className="lead">{t.sequence.lead}</p>
        </div>
        <ol className="ap-steps">
          {t.sequence.steps.map((step, i) => {
            const Screen = screens[i];
            return (
              <li key={step.title} id={stepIds[i]} className="ap-step">
                <Phone label={step.alt}><Screen lang={lang} /></Phone>
                <div className="ap-step-text">
                  <p className="ap-step-meta"><span className="ap-num" aria-hidden>{i + 1}</span><span className="ap-chip chip-pilot">{t.statusLabels.pilot}</span></p>
                  <h3 className="heading">{step.title}</h3>
                  <p className="small muted">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="small muted ap-center">{t.recreated}</p>
      </section>
      {/* Footer anchors, set on the steps above (footer.test.ts reads this file): id="daily-compass" id="how-matching-works" */}

      <section id="limited-pilot" className="wrap ap-section" aria-labelledby="status-title">
        <div className="ap-section-head">
          <p className="eyebrow">{t.status.eyebrow}</p>
          <h2 id="status-title" className="title">{t.status.title}</h2>
          <p className="lead">{t.status.lead}</p>
        </div>
        <div className="ap-status">
          {t.status.columns.map((col) => {
            const Icon = STATUS_ICON[col.key as keyof typeof STATUS_ICON];
            return (
              <section key={col.key} className={`ap-col col-${col.key}`} aria-labelledby={`status-${col.key}`}>
                <h3 id={`status-${col.key}`} className="heading"><Icon weight="fill" aria-hidden />{col.title}</h3>
                <p className="small muted">{col.lead}</p>
                <ul>
                  {col.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
                {col.key === 'planned' ? <StoreBadges lang={lang} /> : null}
              </section>
            );
          })}
        </div>
      </section>

      <section id="questions" className="wrap ap-section" aria-labelledby="faq-title">
        <div className="ap-section-head">
          <h2 id="faq-title" className="title">{t.faq.title}</h2>
        </div>
        <div className="ap-faq">
          {t.faq.items.map((item) => (
            <div key={item.q} className="ap-qa">
              <h3 className="heading">{item.q}</h3>
              <p className="muted">{item.a}</p>
            </div>
          ))}
        </div>
        <p className="muted ap-center">
          {before}<Link href={`/${lang}/about#contact`}>{t.contactLink}</Link>{after}
        </p>
      </section>

      <section className="wrap ap-section" aria-labelledby="final-title">
        <div className="ap-final">
          <h2 id="final-title" className="title">{t.finalTitle}</h2>
          <p className="lead">{t.finalLead}</p>
          <Link href={`/${lang}#tools`} className="btn btn-primary btn-3d">{t.backToTools}<ArrowRight aria-hidden /></Link>
        </div>
      </section>
    </div>
  );
}
