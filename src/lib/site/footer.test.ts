import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { LOCALES } from '../../i18n/config.ts';
import { DOC_PAGES } from './config.ts';
import { FOOTER_KEYS, footerLinks } from './footer.ts';

test('footer has the owner\'s eight items in order, with no "#" links', () => {
  for (const lang of LOCALES) {
    const links = footerLinks(lang);
    assert.deepEqual(links.map((l) => l.key), [...FOOTER_KEYS]);
    for (const { href } of links) assert.ok(href !== '#' && !href.startsWith('#'), href);
  }
});

test('every internal footer link resolves to a route with content in both languages', () => {
  for (const lang of LOCALES) {
    for (const { href } of footerLinks(lang)) {
      if (href.startsWith('mailto:')) continue;
      const path = href.split('#')[0].replace(`/${lang}`, '').replace(/^\//, '');
      if (path === '') continue; // home (#tools section)
      assert.ok(existsSync(`src/app/(portal)/[lang]/${path}/page.tsx`), `route for ${href}`);
      if ((DOC_PAGES as readonly string[]).includes(path)) {
        assert.ok(existsSync(`src/content/legal/${path}.${lang}.md`), `content for ${href}`);
      }
    }
  }
});
