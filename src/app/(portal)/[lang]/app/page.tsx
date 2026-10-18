import type { Metadata } from 'next';
import Link from 'next/link';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { CONTACT_EMAIL } from '@/lib/site/config';
import { pageMeta } from '@/lib/site/meta';
import PatternCard from '@/components/site/PatternCard';
import { ToolHeader } from '@/components/site/ToolPage';

type Props = PageProps<'/[lang]/app'>;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = (await params).lang as Locale;
  const t = site(lang).app;
  return pageMeta(lang, '/app', t.metaTitle, t.metaDescription);
}

export default async function AppPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = site(lang).app;
  const [before, after] = t.contact.split('{email}');
  return (
    <div className="wrap page narrow">
      <ToolHeader lang={lang} title={t.title} lead={t.lead} art="hearts" tile="for-two" />
      <div className="stack-lg">
        <PatternCard tint="amber" motif="feather">
          <div id="status" className="stack" style={{ gap: 8 }}>
            <h2 className="heading">{t.statusTitle}</h2>
            <p>{t.status}</p>
          </div>
        </PatternCard>

        <section className="stack" aria-labelledby="matching">
          <div className="stack" style={{ gap: 6 }}>
            <p className="eyebrow">{t.matchingBadge}</p>
            <h2 id="matching" className="title">{t.matchingTitle}</h2>
          </div>
          <ul className="stack">
            {t.matching.map((line) => <li key={line} className="muted">{line}</li>)}
          </ul>
          <p className="small subtle">{t.matchingNote}</p>
        </section>

        <section className="stack" aria-labelledby="how">
          <h2 id="how" className="title">{t.howTitle}</h2>
          <ol className="steps">
            {t.steps.map((s) => (
              <li key={s.title} className="card">
                <h3 className="heading">{s.title}</h3>
                <p className="small muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <PatternCard tint="teal" motif="palm">
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="heading">{t.profileTitle}</h2>
            <p className="muted">{t.profile}</p>
          </div>
        </PatternCard>

        <PatternCard tint="pink" motif="sprig">
          <div className="stack" style={{ gap: 8 }}>
            <h2 className="heading">{t.quizTitle}</h2>
            <p className="muted">{t.quiz}</p>
          </div>
        </PatternCard>

        <p className="muted">
          {before}<a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>{after}
        </p>
        <div><Link href={`/${lang}#tools`} className="btn btn-primary">{t.backToTools}</Link></div>
      </div>
    </div>
  );
}
