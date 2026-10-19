import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SOCIAL_DOMAINS, SOCIAL_NETWORKS, SOCIAL_URLS, socialLinks } from './social.ts';
import en from '../../i18n/site/en.ts';
import bg from '../../i18n/site/bg.ts';

test('every configured social URL is https on its own network', () => {
  for (const network of SOCIAL_NETWORKS) {
    const url = SOCIAL_URLS[network];
    if (!url) continue;
    const u = new URL(url);
    assert.equal(u.protocol, 'https:', network);
    assert.ok(SOCIAL_DOMAINS[network].hosts.includes(u.hostname), `${network}: ${u.hostname}`);
  }
});

test('empty URLs render nothing; preview renders all six in order', () => {
  const empty = Object.fromEntries(SOCIAL_NETWORKS.map((n) => [n, ''])) as typeof SOCIAL_URLS;
  assert.deepEqual(socialLinks(empty), []);
  assert.deepEqual(socialLinks({ ...empty, youtube: ' https://www.youtube.com/@x ' }), [{ network: 'youtube', href: 'https://www.youtube.com/@x' }]);
  assert.deepEqual(socialLinks(empty, true).map((l) => l.network), [...SOCIAL_NETWORKS]);
});

test('every network has an aria-label in English and Bulgarian', () => {
  for (const network of SOCIAL_NETWORKS) {
    for (const t of [en, bg]) assert.ok(t.footer.social[network].length > 3, network);
  }
});
