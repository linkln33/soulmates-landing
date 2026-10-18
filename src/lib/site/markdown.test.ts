import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseInline, parseMarkdown, safeHref, slug } from './markdown.ts';

test('headings, paragraphs, lists and tables', () => {
  const blocks = parseMarkdown([
    '# Title',
    'Line one',
    'continues here.',
    '',
    '## Section',
    '- first',
    '- **second**',
    '',
    '| A | B |',
    '|---|---|',
    '| 1 | 2 |',
    '| 3 | 4 |',
  ].join('\n'));
  assert.deepEqual(blocks.map((b) => b.kind), ['heading', 'paragraph', 'heading', 'list', 'table']);
  assert.equal(blocks[1].kind === 'paragraph' && blocks[1].text[0].text, 'Line one continues here.');
  assert.equal(blocks[3].kind === 'list' && blocks[3].items.length, 2);
  assert.equal(blocks[4].kind === 'table' && blocks[4].rows.length, 2);
});

test('bold and safe links', () => {
  assert.deepEqual(parseInline('a **b** [c](/en/terms) [d](mailto:x@y.z)'), [
    { kind: 'text', text: 'a ' },
    { kind: 'bold', text: 'b' },
    { kind: 'text', text: ' ' },
    { kind: 'link', text: 'c', href: '/en/terms' },
    { kind: 'text', text: ' ' },
    { kind: 'link', text: 'd', href: 'mailto:x@y.z' },
  ]);
});

test('unsafe links become plain text; HTML stays text', () => {
  assert.ok(parseInline('[x](javascript:alert(1))').every((i) => i.kind === 'text'));
  for (const bad of ['javascript:alert(1)', 'http://insecure.example', '//evil.example', 'data:text/html,x']) assert.equal(safeHref(bad), null, bad);
  const p = parseMarkdown('<script>alert(1)</script>');
  assert.equal(p[0].kind === 'paragraph' && p[0].text[0].kind, 'text');
});

test('heading ids are unique and work for Cyrillic', () => {
  const ids = parseMarkdown('## Контакт\n## Контакт\n## Who we are').filter((b) => b.kind === 'heading').map((b) => b.kind === 'heading' && b.id);
  assert.deepEqual(ids, ['контакт', 'контакт-2', 'who-we-are']);
  assert.equal(slug('  Your rights (UK & EU) '), 'your-rights-uk-eu');
});
