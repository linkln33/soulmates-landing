import type { ReactNode } from 'react';
import Link from 'next/link';
import { LANGS, messages, type Lang } from '@/lib/quiz/messages';

/** EN | БГ switcher. Keeps the current path and the given query parameters. */
function LangSwitch({ lang, path, query }: { lang: Lang; path: string; query: Record<string, string> }) {
  const m = messages(lang);
  return (
    <nav className="lx-lang" aria-label={m.langSwitchLabel}>
      {LANGS.map((l, i) => {
        const params = new URLSearchParams({ ...query, lang: l });
        return (
          <span key={l} className="lx-lang-item">
            {i > 0 && <span className="lx-lang-sep" aria-hidden="true">|</span>}
            {l === lang ? (
              <span className="lx-lang-current" aria-current="true" lang={l} title={m.langFull[l]}>
                {m.langShort[l]}
              </span>
            ) : (
              <Link href={`${path}?${params.toString()}`} replace scroll={false} lang={l} hrefLang={l} title={m.langFull[l]}>
                {m.langShort[l]}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/** Page frame for the quiz pages: scoped theme root, header with switcher, footer. */
export default function QuizShell({
  lang,
  path,
  query = {},
  children,
}: {
  lang: Lang;
  path: string;
  query?: Record<string, string>;
  children: ReactNode;
}) {
  const m = messages(lang);
  return (
    <div className="lexicon" lang={lang}>
      <header className="lx-top">
        <Link href="/" className="lx-brand" aria-label={m.homeLink}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/mark-32.webp" srcSet="/brand/mark-32.webp 1x, /brand/mark-64.webp 2x, /brand/mark-96.webp 3x" alt="" width={32} height={32} />
          <span>Soulmates Quest</span>
        </Link>
        <LangSwitch lang={lang} path={path} query={query} />
      </header>
      <main className="lx-main">{children}</main>
      <footer className="lx-foot">
        <Link href="/">{m.homeLink}</Link>
      </footer>
    </div>
  );
}
