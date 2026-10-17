import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LOCALES, localeFromAcceptLanguage } from './config.ts';
import en from './site/en.ts';
import bg from './site/bg.ts';

test('Accept-Language picks the best supported language', () => {
  assert.equal(localeFromAcceptLanguage('bg-BG,bg;q=0.9,en;q=0.8'), 'bg');
  assert.equal(localeFromAcceptLanguage('de-DE,de;q=0.9,bg;q=0.5'), 'bg');
  assert.equal(localeFromAcceptLanguage('en;q=0.4,bg;q=0.9'), 'bg');
  assert.equal(localeFromAcceptLanguage('fr-FR,fr;q=0.9'), 'en');
  assert.equal(localeFromAcceptLanguage('bg;q=0'), 'en');
  assert.equal(localeFromAcceptLanguage(null), 'en');
});

/** Same shape: every string or list in English exists in every other language. */
function shapeOf(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return [path];
  if (Array.isArray(value)) return [`${path}[${value.length}]`, ...value.flatMap((v, i) => shapeOf(v, `${path}[${i}]`))];
  return Object.entries(value as Record<string, unknown>).flatMap(([k, v]) => shapeOf(v, path ? `${path}.${k}` : k));
}

test('site texts have the same keys and list lengths in every language', () => {
  assert.deepEqual(LOCALES, ['en', 'bg']);
  assert.deepEqual(shapeOf(bg), shapeOf(en));
});

test('the same placeholders appear in both languages', () => {
  const placeholders = (s: unknown): Record<string, string> => {
    const out: Record<string, string> = {};
    const walk = (v: unknown, p: string) => {
      if (typeof v === 'string') out[p] = (v.match(/\{\w+\}/g) ?? []).sort().join(',');
      else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`);
    };
    walk(s, '');
    return out;
  };
  assert.deepEqual(placeholders(bg), placeholders(en));
});

test('user-facing copy avoids internal machinery and invented accuracy', () => {
  const all = JSON.stringify([en, bg]);
  for (const banned of [/16 (spiritual )?systems/i, /confidence/i, /\d+% (match|accura)/i, /Mayan|Gene Keys|Human Design|chakra/i]) {
    assert.doesNotMatch(all, banned);
  }
});
