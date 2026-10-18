import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { isLocale, type Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import PatternCard, { type CardTint } from '@/components/site/PatternCard';
import { MoonNow } from '@/components/tools/MoonTool';
import HeroVisual from '@/components/home/HeroVisual';
import { ConnectionSection } from '@/components/home/HomeSections';
import '@/components/home/home.css';

type Props = PageProps<'/[lang]'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const l = (isLocale(lang) ? lang : 'en') as Locale;
  const t = site(l).home;
  return { ...pageMeta(l, '', t.metaTitle, t.metaDescription), title: { absolute: t.metaTitle } };
}

const TOOLS = [
  { key: 'horoscope', href: '/horoscope', art: 'horoscope-wheel', tile: 'horoscope' },
  { key: 'tarot', href: '/tarot', art: 'tarot', tile: 'tarot' },
  { key: 'numbers', href: '/numbers', art: 'numbers', tile: 'numbers' },
  { key: 'moon', href: '/moon', art: 'moon-phases', tile: 'moon-calendar' },
] as const;

const HONEST: CardTint[] = ['teal', 'amber', 'pink'];

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
            <a href="#tools" className="btn btn-primary">{t.home.ctaReadings} <ArrowRight weight="bold" aria-hidden /></a>
            <Link href={`/${lang}/app`} className="btn btn-outline">{t.home.ctaApp}</Link>
          </div>
        </div>
        <HeroVisual lang={lang} />
      </section>

      <section id="tools" className="wrap h-tools" aria-labelledby="tools-title">
        <div className="h-tools-intro">
          <h2 id="tools-title" className="title">{t.home.toolsTitle}</h2>
          <p className="muted">{t.home.toolsLead}</p>
        </div>
        <ul className="h-tool-list">
          {TOOLS.map((tool) => (
            <li key={tool.key}>
              <Link
                href={`/${lang}${tool.href}`}
                className="h-tool"
                style={{ background: `var(--tile-${tool.tile})` }}
                aria-describedby={`tool-${tool.key}-about`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/app-content/illustrations/${tool.art}.svg`} alt="" width={200} height={150} loading="lazy" decoding="async" />
                <span className="h-tool-text">
                  <span className="heading">{t.nav[tool.key]}</span>
                  <span className="small muted">{t.home.toolsShort[tool.key]}</span>
                  <span id={`tool-${tool.key}-about`} className="visually-hidden">{t.tools[tool.key].about}</span>
                </span>
                <span className="h-arrow" aria-hidden><ArrowRight weight="bold" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

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

      <ConnectionSection lang={lang} />

      <section className="wrap h-final" aria-labelledby="final-title">
        <div className="h-final-card">
          <h2 id="final-title" className="h-title">{t.home.finalTitle}</h2>
          <p className="lead">{t.home.finalLead}</p>
          <div className="h-ctas">
            <a href="#tools" className="btn btn-primary">{t.home.ctaReadings} <ArrowRight weight="bold" aria-hidden /></a>
            <Link href={`/${lang}/app`} className="btn btn-outline">{t.home.ctaApp}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
