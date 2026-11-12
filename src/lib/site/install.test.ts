/**
 * Launch step 1 (API_CONTRACT_V1.md, "Website"): the /install page, its routing and sitemap entry,
 * the certificate fingerprint, the invitation page's order, and no stale "no download" copy.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { APK_CERT_SHA256, installHref } from './appLink.ts';
import { PORTAL_PATHS } from './config.ts';
import en from '../../i18n/site/en.ts';
import bg from '../../i18n/site/bg.ts';

const ROOT = new URL('../../../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, ROOT), 'utf8');

test('the fingerprint on /install is the signing certificate in assetlinks.json', () => {
  const links = JSON.parse(read('public/.well-known/assetlinks.json'));
  assert.deepEqual(links[0].target.sha256_cert_fingerprints, [APK_CERT_SHA256]);
  assert.match(APK_CERT_SHA256, /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
  assert.ok(read('src/app/(portal)/[lang]/install/page.tsx').includes('{APK_CERT_SHA256}'));
});

test('/install exists, is in the sitemap and /install without a language is redirected', () => {
  assert.ok(existsSync(new URL('src/app/(portal)/[lang]/install/page.tsx', ROOT)));
  assert.ok((PORTAL_PATHS as readonly string[]).includes('/install'));
  assert.equal(installHref('bg'), '/bg/install');
  const proxy = read('src/proxy.ts');
  const unprefixed = new RegExp(proxy.match(/const UNPREFIXED = \/(.+)\/;/)![1]);
  assert.ok(unprefixed.test('/install'));
  const matcher = [...proxy.match(/matcher:\s*\[([^\]]*)\]/)![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.ok(matcher.includes('/install'));
});

test('the install steps cover download, unknown apps, Play Protect and opening the app, in both languages', () => {
  for (const [dict, words] of [
    [en, [/download/i, /install unknown apps/i, /Play Protect/, /Open/]],
    [bg, [/Изтегли/, /неизвестни приложения/, /Play Защита/, /Отваряне/]],
  ] as const) {
    assert.equal(dict.install.steps.length, 4);
    dict.install.steps.forEach((step, i) => assert.match(`${step.title} ${step.body}`, words[i]));
    assert.match(dict.install.update, /\S/);
  }
});

test('the invitation guide has three steps and names the app\'s invite field like /install does', () => {
  for (const dict of [en, bg]) {
    assert.equal(dict.referral.steps.length, 3);
    const label = dict.referral.steps[2].match(/[“„]([^”“]+)[”“]/)![1];
    assert.ok(dict.install.steps[3].body.includes(label), label);
  }
  assert.ok(en.referral.steps[2].includes('“Have an invite code?”'));
  assert.ok(bg.referral.steps[2].includes('„Имаш код за покана?“'));
});

test('on a valid invitation, Download for Android comes first, then the guide, then Open in the app', () => {
  const source = read('src/components/invite/ReferralView.tsx');
  const valid = source.slice(source.indexOf('const title ='));
  const order = ['{t.download}', '{install.label}', '{t.stepsTitle}', '{t.steps[0]}', '<CopyCode', '{t.steps[1]}', '{t.steps[2]}', 'referralDeepLink(code)', '{qr}'];
  const positions = order.map((token) => valid.indexOf(token));
  positions.forEach((p, i) => assert.ok(p >= 0, order[i]));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test('the invalid invitation view stays neutral: no name, no code, a download and install help', () => {
  const source = read('src/components/invite/ReferralView.tsx');
  const invalid = source.slice(source.indexOf("state.status === 'invalid'"), source.indexOf('const title ='));
  assert.ok(invalid.includes('{t.download}') && invalid.includes('{install.label}'));
  assert.ok(!/firstName|CopyCode|\{code|referralDeepLink/.test(invalid));
});

test('no stale "no public download" or "Coming to Android" copy, and no promises on /install', () => {
  const all = JSON.stringify([en, bg]);
  assert.doesNotMatch(all, /no public download|Coming (soon )?to Android|няма публично изтегляне|Скоро в Android/i);
  for (const dict of [en, bg]) {
    assert.doesNotMatch(JSON.stringify(dict.install), /match|admi|guarantee|score|%|съвпад|прием|гаранц|резултат/i);
  }
});
