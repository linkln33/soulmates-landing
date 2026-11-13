/**
 * Stripe checkout return page /{lang}/checkout/done (API_CONTRACT_V1.md, Stripe "As built"):
 * each state's text, the deep link, noindex, no session id, not in the sitemap, and the
 * language redirect keeping the query.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { CHECKOUT_DEEP_LINK, CHECKOUT_PATH, checkoutDeepLink, checkoutState, checkoutView, stripSessionId } from './checkout.ts';
import { PORTAL_PATHS } from './config.ts';
import en from '../../i18n/site/en.ts';
import bg from '../../i18n/site/bg.ts';

const ROOT = new URL('../../../', import.meta.url);
const read = (path: string) => readFileSync(new URL(path, ROOT), 'utf8');
const PAGE = 'src/app/(portal)/[lang]/checkout/done/page.tsx';

test('the checkout query value picks the state; anything else is neutral', () => {
  assert.equal(checkoutState('success'), 'success');
  assert.equal(checkoutState('cancelled'), 'cancelled');
  assert.equal(checkoutState(undefined), 'unknown');
  assert.equal(checkoutState(''), 'unknown');
  assert.equal(checkoutState('SUCCESS'), 'unknown');
  assert.equal(checkoutState('canceled'), 'unknown');
  assert.equal(checkoutState(['success', 'success']), 'unknown');
});

test('success thanks the member, says the payment is being confirmed and points back to the app', () => {
  const v = checkoutView(en.checkout, 'success');
  assert.equal(`${v.title}. ${v.body}`, 'Thank you. Your payment is being confirmed. Return to the app — your membership appears there automatically within a minute.');
  assert.equal(v.button, 'Open the app');
  assert.equal(v.href, 'soulmatesquest://checkout?checkout=success');
  assert.equal(v.note, 'If the app doesn’t open, open SoulMates Quest yourself.');
});

test('cancelled says no payment was made', () => {
  const v = checkoutView(en.checkout, 'cancelled');
  assert.equal(`${v.title}. ${v.body}`, 'No payment was made. You can return to the app and try again whenever you like.');
  assert.equal(v.href, 'soulmatesquest://checkout?checkout=cancelled');
});

test('the neutral version never claims a payment', () => {
  for (const dict of [en, bg]) {
    const v = checkoutView(dict.checkout, 'unknown');
    assert.notEqual(v.body, checkoutView(dict.checkout, 'success').body);
    assert.doesNotMatch(`${v.title} ${v.body}`, /thank|being confirmed|благодар|потвърждава/i);
  }
  assert.match(en.checkout.unknown.body, /^Return to the app\. If a payment was completed/);
});

test('the deep link is the app\'s checkout return link, with the state when known', () => {
  const appJson = new URL('../SoulMates-Quest-mobile/app.json', ROOT);
  if (existsSync(appJson)) {
    const scheme = JSON.parse(readFileSync(appJson, 'utf8')).expo.scheme;
    assert.ok(CHECKOUT_DEEP_LINK.startsWith(`${scheme}://`));
  }
  assert.equal(CHECKOUT_DEEP_LINK, 'soulmatesquest://checkout');
  assert.equal(checkoutDeepLink('success'), 'soulmatesquest://checkout?checkout=success');
  assert.equal(checkoutDeepLink('cancelled'), 'soulmatesquest://checkout?checkout=cancelled');
  assert.equal(checkoutDeepLink('unknown'), 'soulmatesquest://checkout');
  assert.equal(checkoutView(bg.checkout, 'unknown').href, 'soulmatesquest://checkout');
});

test('no prices, amounts or terms on the page, in either language', () => {
  for (const dict of [en, bg]) {
    const all = JSON.stringify(dict.checkout);
    assert.doesNotMatch(all, /€|EUR|\d|terms|условия|price|цена/i);
  }
});

test('the page is noindex and never reads, shows or logs the session id or calls the backend', () => {
  const page = read(PAGE).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false\s*\}/);
  assert.doesNotMatch(page, /session_id|sessionId|session/i);
  assert.doesNotMatch(page, /fetch\(|API_BASE|console\./);
  assert.match(page, /searchParams\)\.checkout\)/);
  assert.doesNotMatch(read('src/lib/site/checkout.ts'), /fetch\(|console\./);
  assert.doesNotMatch(read('src/proxy.ts'), /console\./);
  const config = read('next.config.ts');
  assert.ok(config.includes('source: "/:lang(en|bg)/checkout/:path*"'));
});

test('the checkout page is not in the sitemap', () => {
  assert.ok(!(PORTAL_PATHS as readonly string[]).some((p) => p.startsWith('/checkout')));
  assert.doesNotMatch(read('src/app/sitemap.ts'), /checkout/);
});

test('/checkout/done without a language is redirected with its query kept, minus the session id', () => {
  const proxy = read('src/proxy.ts');
  const unprefixed = new RegExp(proxy.match(/const UNPREFIXED = \/(.+)\/;/)![1]);
  assert.ok(unprefixed.test('/checkout/done'));
  assert.ok(!unprefixed.test('/en/checkout/done'));
  const matcher = [...proxy.match(/matcher:\s*\[([^\]]*)\]/)![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  for (const m of ['/checkout/:path*', '/en/checkout/:path*', '/bg/checkout/:path*']) assert.ok(matcher.includes(m), m);
  assert.match(proxy, /url\.search = query;/);
  assert.match(proxy, /CHECKOUT_PATH\.test\(pathname\) \? stripSessionId\(search\) : search/);
});

test('checkout URLs keep every parameter except session_id', () => {
  for (const p of ['/checkout/done', '/en/checkout/done', '/bg/checkout/done', '/checkout']) assert.ok(CHECKOUT_PATH.test(p), p);
  for (const p of ['/en/checkouts', '/de/checkout/done', '/en/install']) assert.ok(!CHECKOUT_PATH.test(p), p);
  assert.equal(stripSessionId('?checkout=success&session_id=cs_test_a1'), '?checkout=success');
  assert.equal(stripSessionId('?session_id=cs_test_a1&checkout=success'), '?checkout=success');
  assert.equal(stripSessionId('?checkout=cancelled'), '?checkout=cancelled');
  assert.equal(stripSessionId('?session_id=x'), '');
  assert.equal(stripSessionId(''), '');
  // What the proxy builds for /checkout/done?… from a Bulgarian browser.
  const url = new URL('https://www.soulmates.quest/checkout/done?checkout=success&session_id=cs_test_x');
  url.search = stripSessionId(url.search);
  url.pathname = `/bg${url.pathname}`;
  assert.equal(url.href, 'https://www.soulmates.quest/bg/checkout/done?checkout=success');
});
