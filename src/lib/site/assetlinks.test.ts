/**
 * Android App Links: public/.well-known/assetlinks.json, served as a static file at
 * https://www.soulmates.quest/.well-known/assetlinks.json (see docs/ANDROID_APP_LINKS.md).
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ROOT = new URL('../../../', import.meta.url);
const PATH = '/.well-known/assetlinks.json';

test('assetlinks.json declares the app package and the current signing certificate', () => {
  const links = JSON.parse(readFileSync(new URL(`public${PATH}`, ROOT), 'utf8'));
  assert.deepEqual(links, [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.soulmatesquest.app',
        sha256_cert_fingerprints: ['35:33:8B:97:C7:17:1E:CB:65:7C:9E:01:2E:76:B7:28:B5:DE:95:9E:61:3A:12:BA:43:3A:4C:E3:4F:83:BE:85'],
      },
    },
  ]);
  for (const fp of links[0].target.sha256_cert_fingerprints) assert.match(fp, /^([0-9A-F]{2}:){31}[0-9A-F]{2}$/);
});

/** The proxy's matcher entries and its language-redirect pattern, read from src/proxy.ts. */
function proxyRules() {
  const source = readFileSync(new URL('src/proxy.ts', ROOT), 'utf8');
  const matcher = [...source.match(/matcher:\s*\[([^\]]*)\]/)![1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const unprefixed = new RegExp(source.match(/const UNPREFIXED = \/(.+)\/;/)![1]);
  return { matcher, unprefixed };
}

/** Next.js matcher syntax, enough for the entries used here: `:path*` matches any rest. */
const matcherRe = (pattern: string) => new RegExp(`^${pattern.replace(/\./g, '\\.').replace(/\/:path\*/g, '(?:/.*)?')}$`);

test('the language proxy leaves /.well-known alone', () => {
  const { matcher, unprefixed } = proxyRules();
  assert.ok(matcher.length > 0);
  assert.ok(matcher.includes('/r/:path*'), 'sanity: the parser sees the real matcher');
  for (const m of matcher) assert.ok(!matcherRe(m).test(PATH), m);
  assert.ok(!unprefixed.test(PATH));
  assert.ok(unprefixed.test('/r/abcd2345'), 'sanity: the parser sees the real pattern');
});

test('next.config redirects only the vercel.app host, so /.well-known is served on www', async () => {
  process.env.NEXT_PUBLIC_API_URL ??= 'https://soul-mates-backend.vercel.app/api';
  const { default: config } = await import('../../../next.config.ts');
  const redirects = (await config.redirects?.()) ?? [];
  for (const r of redirects) {
    assert.deepEqual(r.has, [{ type: 'host', value: 'soulmates-landing.vercel.app' }], r.source);
  }
  assert.equal(config.rewrites, undefined);
});
