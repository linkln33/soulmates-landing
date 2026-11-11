import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { isLocale, type Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import PatternCard, { type CardTint } from '@/components/site/PatternCard';
import { MoonNow } from '@/components/tools/MoonTool';
import HeroVisual from '@/components/home/HeroVisual';
import StoreBadges from '@/components/site/StoreBadges';
import { JourneySection } from '@/components/home/HomeSections';
import GuideCovers from '@/components/home/GuideCovers';
import { appSectionHref } from '@/lib/site/appLink';
import '@/components/home/home.css';

type Props = PageProps<'/[lang]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : 'en') as Locale;
  const t = site(l).home;
  return { ...pageMeta(l, '', t.metaTitle, t.metaDescription), title: { absolute: t.metaTitle } };
}

const HONEST: CardTint[] = ['teal', 'amber', 'pink'];

/**
 * The tile's 2:1 cover, decorative (the link is named by its text). A painted
 * cover has one <picture> per theme; CSS shows the one matching <html
 * data-theme> and hides the other, and lazy images that are not rendered are
 * never fetched, so only one painting loads. Without a painting, the app
 * illustration sits on the tile tint.
 */
export default async function Home({ params }: Props) {
  const { lang: raw } = await params;
  const lang = raw as Locale;
  const t = site(lang);
  return (
    <div className="home">
      <section className="wrap h-hero" aria-labelledby="hero-title">
        <div className="h-hero-text">
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1 id="hero-title" className="h-display">
            <span>{t.home.titleTop}</span> <span className="h-accent">{t.home.titleAccent}</span>
          </h1>
          <p className="h-lead">{t.home.lead}</p>
          <div className="h-ctas">
            <a href="#tools" className="btn btn-primary btn-3d">{t.home.ctaReadings} <ArrowRight weight="bold" aria-hidden /></a>
            <Link href={appSectionHref(lang)} className="btn btn-glass btn-3d">{t.home.ctaApp}</Link>
          </div>
          <StoreBadges lang={lang} className="h-stores" />
        </div>
        <HeroVisual lang={lang} />
      </section>

      <GuideCovers lang={lang} t={t.appV2} downloadLabel={t.nav.download} />

      <section className="h-section" aria-labelledby="readings-title">
        <div className="wrap stack-lg">
          <div className="h-head">
            <p className="eyebrow">{t.home.readingsEyebrow}</p>
            <h2 id="readings-title" className="h-title">{t.home.readingsTitle}</h2>
            <p className="lead">{t.home.readingsLead}</p>
          </div>
          <div className="grid-2">
            <MoonNow lang={lang} />
            <PatternCard tint="plain" motif={null} aria-labelledby="soon-title">
              <div className="stack">
                <h3 id="soon-title" className="heading">{t.home.soonTitle}</h3>
                <p className="small muted">{t.home.soonLead}</p>
                <ul className="soon-list">
                  {t.home.soon.map((s) => <li key={s}>{s}</li>)}
                </ul>
              </div>
            </PatternCard>
          </div>
          <div className="stack">
            <h3 className="heading">{t.home.honestTitle}</h3>
            <div className="tiles h-honest">
              {t.home.honest.map((item, i) => (
                <PatternCard key={item.title} tint={HONEST[i]} motif={null} as="div">
                  <div className="stack" style={{ gap: 6 }}>
                    <h4 className="heading">{item.title}</h4>
                    <p className="small muted">{item.body}</p>
                  </div>
                </PatternCard>
              ))}
            </div>
            <p className="small subtle">{t.reflection}</p>
          </div>
        </div>
      </section>

      <JourneySection lang={lang} />

      <section className="wrap h-final" aria-labelledby="final-title">
        <div className="h-final-card">
          <h2 id="final-title" className="h-title">{t.home.finalTitle}</h2>
          <p className="lead">{t.home.finalLead}</p>
          <div className="h-ctas">
            <a href="#tools" className="btn btn-primary btn-3d">{t.home.ctaReadings} <ArrowRight weight="bold" aria-hidden /></a>
            <Link href={appSectionHref(lang)} className="btn btn-glass btn-3d">{t.home.ctaApp}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
