import { test } from 'node:test';
import assert from 'node:assert/strict';
import { breadcrumbJsonLd } from './jsonld.ts';

test('breadcrumb JSON-LD lists the trail with absolute URLs and escapes "<"', () => {
  const data = JSON.parse(breadcrumbJsonLd([{ name: 'Home', path: '/en' }, { name: 'The app </script>', path: '/en/app' }]));
  assert.equal(data['@type'], 'BreadcrumbList');
  assert.deepEqual(data.itemListElement.map((i: { position: number }) => i.position), [1, 2]);
  assert.equal(data.itemListElement[1].item, 'https://www.soulmates.quest/en/app');
  assert.ok(!breadcrumbJsonLd([{ name: '</script>', path: '/en' }]).includes('</'));
});
