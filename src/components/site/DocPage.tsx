/**
 * Shared page for the document routes (/{lang}/about, privacy, terms, safety,
 * delete-account). Text comes from src/content/legal/{slug}.{lang}.md and is
 * read at build time. Drafts show a banner and are not indexed.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { site } from '@/i18n';
import { DRAFT_DOCS, type DocPage as Doc } from '@/lib/site/config';
import { pageMeta } from '@/lib/site/meta';
import Markdown from './Markdown';

export function docSource(doc: Doc, lang: Locale): string {
  return readFileSync(path.join(process.cwd(), 'src', 'content', 'legal', `${doc}.${lang}.md`), 'utf8');
}

/** The document's own "# " title. */
export function docTitle(source: string): string {
  return /^#\s+(.+)$/m.exec(source)?.[1].trim() ?? '';
}

export function docMetadata(doc: Doc, lang: Locale): Metadata {
  const t = site(lang).docs;
  const draft = DRAFT_DOCS.includes(doc);
  const title = docTitle(docSource(doc, lang)) + (draft ? ` ${t.draftSuffix}` : '');
  return {
    ...pageMeta(lang, `/${doc}`, title, t.descriptions[doc]),
    ...(draft ? { robots: { index: false, follow: true } } : {}),
  };
}

export default function DocPage({ doc, lang }: { doc: Doc; lang: Locale }) {
  const t = site(lang).docs;
  return (
    <div className="wrap page narrow doc">
      {DRAFT_DOCS.includes(doc) ? <div className="draft-banner" role="note">{t.draftBanner}</div> : null}
      <Markdown source={docSource(doc, lang)} />
    </div>
  );
}
