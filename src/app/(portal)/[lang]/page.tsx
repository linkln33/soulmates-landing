import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { isLocale, type Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { pageMeta } from '@/lib/site/meta';
import PatternCard, { Pattern, type CardMotif, type CardTint } from '@/components/site/PatternCard';
import { MoonNow } from '@/components/tools/MoonTool';

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

const HONEST: { tint: CardTint; motif: CardMotif }[] = [
  { tint: 'teal', motif: 'palm' },
  { tint: 'amber', motif: 'feather' },
  { tint: 'pink', motif: 'sprig' },
];

export default async function Home({ params }: Props) {
  const { lang: raw } = await params;
  const lang = raw as Locale;
  const t = site(lang);
  return (
    <>
      <section className="wrap">
        <div className="hero">
          <div>
            <p className="eyebrow">{t.home.eyebrow}</p>
            <h1 className="display">{t.home.title}</h1>
            <p className="lead">{t.home.lead}</p>
            <div className="row" style={{ marginTop: 22 }}>
              <a href="#tools" className="btn btn-primary">{t.home.start}</a>
            </div>
          </div>
          <div className="hero-art" aria-hidden>
            <Pattern name="sprig" className="motif" style={{ width: 170, height: 170, top: -40, right: -30, color: 'var(--card-pink-pattern)', transform: 'scaleY(-1)' }} />
            <Pattern name="constellation" className="motif" style={{ width: 120, height: 88, bottom: 18, left: 18, color: 'var(--card-teal-pattern)' }} />
            <Pattern name="sparkles" className="motif" style={{ width: 110, height: 72, top: 24, left: 30, color: 'var(--card-pink-pattern)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="logo" src="/app-content/logo.png" alt="" width={1373} height={655} />
          </div>
        </div>
      </section>

      <section id="tools" className="wrap page" aria-labelledby="tools-title" style={{ scrollMarginTop: 80 }}>
        <div className="stack" style={{ marginBottom: 20 }}>
          <h2 id="tools-title" className="title">{t.home.toolsTitle}</h2>
          <p className="muted">{t.home.toolsLead}</p>
        </div>
        <ul className="tiles" style={{ listStyle: 'none' }}>
          {TOOLS.map((tool) => (
            <li key={tool.key} style={{ display: 'flex' }}>
              <Link href={`/${lang}${tool.href}`} className="tile" style={{ flex: 1 }}>
                <div className="tile-art" style={{ background: `var(--tile-${tool.tile})` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/app-content/illustrations/${tool.art}.svg`} alt="" width={200} height={150} />
                </div>
                <div className="tile-body">
                  <span className="heading">
                    {t.tools[tool.key].title}
                    <ArrowRight className="tile-arrow" size={20} weight="bold" aria-hidden />
                  </span>
                  <span className="small muted">{t.tools[tool.key].about}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap" aria-label={t.home.moonTitle}>
        <div className="grid-2">
          <MoonNow lang={lang} />
          <PatternCard tint="plain" motif="lotus" aria-label={t.home.soonTitle}>
            <div className="stack">
              <h2 className="heading">{t.home.soonTitle}</h2>
              <p className="small muted">{t.home.soonLead}</p>
              <ul className="soon-list">
                {t.home.soon.map((s) => <li key={s}>{s}</li>)}
              </ul>
            </div>
          </PatternCard>
        </div>
      </section>

      <section className="wrap page" aria-labelledby="honest-title">
        <h2 id="honest-title" className="title" style={{ marginBottom: 20 }}>{t.home.honestTitle}</h2>
        <div className="tiles" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
          {t.home.honest.map((item, i) => (
            <PatternCard key={item.title} tint={HONEST[i].tint} motif={HONEST[i].motif} as="div">
              <div className="stack" style={{ gap: 6 }}>
                <h3 className="heading">{item.title}</h3>
                <p className="small muted">{item.body}</p>
              </div>
            </PatternCard>
          ))}
        </div>
      </section>
    </>
  );
}
