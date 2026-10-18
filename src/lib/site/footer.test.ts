import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LOCALES } from '../../i18n/config.ts';
import { DOC_PAGES } from './config.ts';
import { footerColumns } from './footer.ts';

test('four columns of four items, no "#" or mailto links', () => {
  for (const lang of LOCALES) {
    const cols = footerColumns(lang);
    assert.deepEqual(cols.map((c) => c.key), ['readings', 'app', 'support', 'legal']);
    for (const c of cols) {
      assert.equal(c.items.length, 4, c.key);
      for (const item of c.items) {
        for (const { href } of item.links) {
          assert.ok(href.startsWith(`/${lang}`), href);
          assert.ok(!href.endsWith('#') && !href.startsWith('mailto:'), href);
        }
      }
    }
  }
});

/** The ids a destination page renders: id="…" in a route file, or {#…}/headings in its Markdown. */
function anchorExists(path: string, lang: string, anchor: string): boolean {
  if ((DOC_PAGES as readonly string[]).includes(path)) {
    return readFileSync(`src/content/legal/${path}.${lang}.md`, 'utf8').includes(`{#${anchor}}`);
  }
  const file = path === '' ? 'src/app/(portal)/[lang]/page.tsx' : `src/app/(portal)/[lang]/${path}/page.tsx`;
  return readFileSync(file, 'utf8').includes(`id="${anchor}"`);
}

test('every footer link resolves to a route, its content and its anchor in both languages', () => {
  for (const lang of LOCALES) {
    for (const { items } of footerColumns(lang)) {
      for (const { href } of items.flatMap((i) => i.links)) {
        const [pathPart, anchor] = href.split('#');
        const path = pathPart.replace(`/${lang}`, '').replace(/^\//, '');
        if (path !== '') assert.ok(existsSync(`src/app/(portal)/[lang]/${path}/page.tsx`), `route for ${href}`);
        if ((DOC_PAGES as readonly string[]).includes(path)) assert.ok(existsSync(`src/content/legal/${path}.${lang}.md`), `content for ${href}`);
        if (anchor) assert.ok(anchorExists(path, lang, anchor), `anchor for ${href}`);
      }
    }
  }
});
