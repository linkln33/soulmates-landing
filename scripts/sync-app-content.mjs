#!/usr/bin/env node
/**
 * Sync the app's approved reading content and design assets into the website.
 *
 *   node scripts/sync-app-content.mjs            write src/content/app/* and public/app-content/*
 *   node scripts/sync-app-content.mjs --check    verify the committed copies match the app (no writes)
 *
 * Source: the mobile repository (default ../SoulMates-Quest-mobile, or
 * APP_REPO=<path>). Files are read exactly as the app builds them; nothing in
 * the outputs is edited by hand. The manifest (src/content/app/manifest.json)
 * records the app commit and a SHA-256 for every input and output, so
 * `npm test` can detect a hand-edited copy without the mobile repo.
 *
 * Tarot deck check: the 78 card keys must be identical in the text file, the
 * image map and SOURCE.json; each WebP's size must match SOURCE.json, and when
 * the source PNGs are present their SHA-256 must match SOURCE.json too.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { stripTypeScriptTypes } from 'node:module';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = resolve(process.env.APP_REPO || join(WEB, '..', 'SoulMates-Quest-mobile'));
const CHECK = process.argv.includes('--check');
const ALLOW_DIRTY = process.argv.includes('--allow-dirty');

const CONTENT_OUT = join(WEB, 'src/content/app');
const PUBLIC_OUT = join(WEB, 'public/app-content');

/** i18n sections the website's tools use (lib/i18n/messages/{en,bg}.ts). */
const MESSAGE_SECTIONS = [
  'common', 'states', 'indicators', 'moon', 'signs', 'signIn', 'signInto', 'signFacts', 'tools', 'horoscope', 'themes',
  'moonCalendar', 'dates', 'numbersReading', 'tarotReading',
];
const PATTERN_KEYS = ['sprig', 'palm', 'feather', 'crown', 'diamond', 'lotus', 'constellation', 'sparkles', 'cloud', 'crescent'];
const ILLUSTRATION_KEYS = [
  'tarot', 'coffee', 'horoscope-wheel', 'dreams', 'hearts', 'tools-grid', 'moon-sky', 'crystal-teal',
  'crystal-violet', 'leaves-pink', 'leaves-amber', 'moon-phases', 'numbers', 'runes', 'book',
];
/** Inputs whose content must be committed in the app (not a dirty working copy). */
const TRACKED_INPUTS = [
  'lib/i18n/messages/en.ts', 'lib/i18n/messages/bg.ts', 'lib/readings/content/horoscopeTexts.ts',
  'lib/readings/content/tarotCards.ts', 'lib/readings/content/tarotImages.ts', 'lib/readings/signs.ts',
  'lib/design/tokens.ts', 'assets/tarot', 'assets/patterns', 'assets/illustrations', 'assets/brand/logo-refined.png',
];

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const fail = (msg) => { console.error(`sync-app-content: ${msg}`); process.exit(1); };
const json = (value) => `${JSON.stringify(value, null, 1)}\n`;

function git(...args) {
  return execFileSync('git', ['-C', APP, ...args], { encoding: 'utf8' }).trim();
}

async function importTs(rel) {
  const mod = await import(pathToFileURL(join(APP, rel)).href);
  return mod;
}

/**
 * Colour, spacing and radius tokens from lib/design/tokens.ts. That module
 * imports react-native, so only its plain data blocks (palette … radii) are
 * taken, type-stripped by Node and evaluated.
 */
async function designTokens() {
  const source = readFileSync(join(APP, 'lib/design/tokens.ts'), 'utf8');
  const start = source.indexOf('export const palette');
  const end = source.indexOf('export const touchTarget');
  if (start < 0 || end < start) fail('lib/design/tokens.ts: palette … radii block not found');
  const js = stripTypeScriptTypes(source.slice(start, end), { mode: 'strip' });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
  const { palette, colors, spacing, radii } = mod;
  if (!palette?.pink || !colors?.light || !colors?.dark || !radii) fail('lib/design/tokens.ts: unexpected token shape');
  return { palette, light: colors.light, dark: colors.dark, spacing, radii };
}

/** Inner markup and viewBox of a single-root SVG file (patterns are drawn in currentColor). */
function svgParts(source, name) {
  const m = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/.exec(source);
  if (!m) fail(`${name}: not a single <svg> element`);
  const viewBox = /viewBox="([^"]+)"/.exec(m[1])?.[1];
  if (!viewBox) fail(`${name}: no viewBox`);
  if (/<script|on[a-z]+=|href=|<foreignObject/i.test(m[2])) fail(`${name}: contains scripts, events or links`);
  return { viewBox, body: m[2].replace(/<!--[\s\S]*?-->/g, '').replace(/\s+/g, ' ').trim() };
}

async function build() {
  if (!existsSync(join(APP, 'lib/readings/content/tarotCards.ts'))) fail(`app repository not found at ${APP} (set APP_REPO)`);

  const commit = git('rev-parse', 'HEAD');
  const dirty = git('status', '--porcelain', '--', ...TRACKED_INPUTS);
  if (dirty && !ALLOW_DIRTY) fail(`app inputs have uncommitted changes; commit them in the app first:\n${dirty}`);

  const outputs = new Map(); // relative path (from WEB) -> Buffer
  const inputs = {};
  const readInput = (rel) => {
    const buf = readFileSync(join(APP, rel));
    inputs[rel] = sha256(buf);
    return buf;
  };

  // ── Texts ──
  for (const rel of TRACKED_INPUTS.filter((p) => p.endsWith('.ts'))) readInput(rel);
  const en = (await importTs('lib/i18n/messages/en.ts')).default;
  const bg = (await importTs('lib/i18n/messages/bg.ts')).default;
  const { HOROSCOPE_TEXTS } = await importTs('lib/readings/content/horoscopeTexts.ts');
  const { TAROT_CARDS } = await importTs('lib/readings/content/tarotCards.ts');
  const { SIGN_FACTS } = await importTs('lib/readings/signs.ts');
  const tokens = await designTokens();

  const pick = (msgs, lang) => Object.fromEntries(MESSAGE_SECTIONS.map((s) => {
    if (!(s in msgs)) fail(`messages.${lang}.${s} missing in the app`);
    return [s, msgs[s]];
  }));
  outputs.set('src/content/app/messages.en.json', Buffer.from(json(pick(en, 'en'))));
  outputs.set('src/content/app/messages.bg.json', Buffer.from(json(pick(bg, 'bg'))));
  outputs.set('src/content/app/horoscopeTexts.json', Buffer.from(json(HOROSCOPE_TEXTS)));
  outputs.set('src/content/app/tarotCards.json', Buffer.from(json(TAROT_CARDS)));
  outputs.set('src/content/app/signs.json', Buffer.from(json(SIGN_FACTS)));
  outputs.set('src/content/app/tokens.json', Buffer.from(json(tokens)));

  // ── Tarot deck ──
  const source = JSON.parse(readInput('assets/tarot/SOURCE.json').toString('utf8'));
  const textKeys = Object.keys(TAROT_CARDS).sort();
  const sourceKeys = Object.keys(source.cards).sort();
  const imageMap = readFileSync(join(APP, 'lib/readings/content/tarotImages.ts'), 'utf8');
  const imageKeys = [...imageMap.matchAll(/^\s*"?([a-z_]+)"?\s*:\s*require\('(?:@\/|(?:\.\.\/)+)assets\/tarot\/([a-z_]+)\.webp'\)/gm)]
    .map(([, key, file]) => { if (key !== file) fail(`tarotImages.ts maps ${key} to ${file}.webp`); return key; })
    .sort();
  if (textKeys.length !== 78) fail(`expected 78 card texts, found ${textKeys.length}`);
  for (const [name, keys] of [['SOURCE.json', sourceKeys], ['tarotImages.ts', imageKeys]]) {
    if (keys.join() !== textKeys.join()) fail(`${name} keys differ from tarotCards.ts`);
  }
  const pngDir = join(APP, 'assets/tarot-cards');
  const havePngs = existsSync(pngDir);
  for (const key of textKeys) {
    const rel = `assets/tarot/${key}.webp`;
    const webp = readInput(rel);
    const entry = source.cards[key];
    if (webp.length !== entry.bytes) fail(`${rel}: ${webp.length} bytes, SOURCE.json says ${entry.bytes}`);
    if (webp.subarray(0, 4).toString() !== 'RIFF' || webp.subarray(8, 12).toString() !== 'WEBP') fail(`${rel}: not a WebP file`);
    if (havePngs) {
      const png = join(pngDir, entry.source);
      if (!existsSync(png)) fail(`source ${entry.source} for ${key} is missing`);
      if (sha256(readFileSync(png)) !== entry.sha256) fail(`source ${entry.source} hash differs from SOURCE.json`);
    }
    outputs.set(`public/app-content/tarot/${key}.webp`, webp);
  }

  // ── Patterns, illustrations, logo ──
  const patterns = {};
  for (const key of PATTERN_KEYS) patterns[key] = svgParts(readInput(`assets/patterns/${key}.svg`).toString('utf8'), `${key}.svg`);
  outputs.set('src/content/app/patterns.json', Buffer.from(json(patterns)));
  for (const key of ILLUSTRATION_KEYS) {
    const svg = readInput(`assets/illustrations/${key}.svg`);
    if (/<script|\son[a-z]+=|<foreignObject/i.test(svg.toString('utf8'))) fail(`${key}.svg contains scripts or events`);
    outputs.set(`public/app-content/illustrations/${key}.svg`, svg);
  }
  outputs.set('public/app-content/logo.png', readInput('assets/brand/logo-refined.png'));

  const manifest = {
    note: 'Generated by scripts/sync-app-content.mjs from the SoulMates Quest app. Do not edit synced files by hand.',
    app: { repository: 'SoulMates-Quest-mobile', commit, deck: source.deck, tarotSourcePngsVerified: havePngs },
    inputs,
    outputs: Object.fromEntries([...outputs].map(([rel, buf]) => [rel, sha256(buf)]).sort(([a], [b]) => a.localeCompare(b))),
  };
  return { outputs, manifest };
}

const { outputs, manifest } = await build();
const manifestPath = 'src/content/app/manifest.json';

if (CHECK) {
  const problems = [];
  for (const [rel, buf] of outputs) {
    const file = join(WEB, rel);
    if (!existsSync(file)) problems.push(`missing ${rel}`);
    else if (sha256(readFileSync(file)) !== sha256(buf)) problems.push(`differs from the app: ${rel}`);
  }
  const committed = existsSync(join(WEB, manifestPath)) ? JSON.parse(readFileSync(join(WEB, manifestPath), 'utf8')) : null;
  if (!committed || JSON.stringify(committed.outputs) !== JSON.stringify(manifest.outputs)) problems.push(`${manifestPath} is out of date`);
  if (problems.length) fail(`out of sync with the app (${manifest.app.commit.slice(0, 7)}); run npm run sync:app\n  ${problems.join('\n  ')}`);
  console.log(`In sync with app ${manifest.app.commit.slice(0, 7)}: ${outputs.size} files.`);
} else {
  rmSync(CONTENT_OUT, { recursive: true, force: true });
  // public/app-content/covers is not synced: encoded painted covers made by scripts/make-covers.mjs.
  for (const entry of existsSync(PUBLIC_OUT) ? readdirSync(PUBLIC_OUT) : []) {
    if (entry !== 'covers') rmSync(join(PUBLIC_OUT, entry), { recursive: true, force: true });
  }
  for (const [rel, buf] of outputs) {
    mkdirSync(dirname(join(WEB, rel)), { recursive: true });
    writeFileSync(join(WEB, rel), buf);
  }
  writeFileSync(join(WEB, manifestPath), json(manifest));
  const deck = readdirSync(join(PUBLIC_OUT, 'tarot')).length;
  console.log(`Synced ${outputs.size} files from app ${manifest.app.commit.slice(0, 7)} (${deck} tarot cards) into ${relative(process.cwd(), WEB) || '.'}.`);
}
