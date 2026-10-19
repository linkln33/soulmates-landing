#!/usr/bin/env node
/**
 * Encode the app's painted tile covers for the website's home "Explore free
 * readings" tiles.
 *
 *   node scripts/make-covers.mjs horoscope=zodiac tarot=tarot
 *
 * Each argument is <site key>=<app painting name>. The script reads
 * SoulMates-Quest-mobile/assets/cards/<name>-light.jpg and <name>-dark.jpg
 * (default ../SoulMates-Quest-mobile, or APP_REPO=<path>), never modifies
 * them, and writes public/app-content/covers/<site key>-<light|dark>-<600|1200>.<avif|webp>
 * plus an entry in public/app-content/covers/SOURCE.json (source SHA-256,
 * app commit, output bytes). The tile is at most ~570 CSS px wide, so 600 is
 * 1x and 1200 is 2x. Paintings are shown whole (2:1), never cropped.
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const APP = resolve(process.env.APP_REPO || join(WEB, '..', 'SoulMates-Quest-mobile'));
const OUT = join(WEB, 'public/app-content/covers');
const WIDTHS = [600, 1200];
const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

const pairs = process.argv.slice(2).map((a) => a.split('='));
if (!pairs.length || pairs.some((p) => p.length !== 2 || !/^[a-z-]+$/.test(p[0]) || !/^[a-z-]+$/.test(p[1]))) {
  console.error('usage: node scripts/make-covers.mjs <site key>=<app painting name> ...');
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });
const sourcePath = join(OUT, 'SOURCE.json');
const source = existsSync(sourcePath) ? JSON.parse(readFileSync(sourcePath, 'utf8')) : { covers: {} };
source.note = 'owner-supplied artwork, copied from the mobile assets/cards (SoulMates-Quest-mobile/assets/cards). The originals stay untouched; regenerate with scripts/make-covers.mjs.';
const commit = execFileSync('git', ['-C', APP, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();

for (const [key, name] of pairs) {
  for (const theme of ['light', 'dark']) {
    const rel = `assets/cards/${name}-${theme}.jpg`;
    const input = readFileSync(join(APP, rel));
    const outputs = {};
    for (const w of WIDTHS) {
      const base = sharp(input).resize({ width: w }).toColourspace('srgb');
      const avif = await base.clone().avif({ quality: 52, effort: 9, chromaSubsampling: '4:4:4' }).toBuffer();
      const webp = await base.clone().webp({ quality: 78, effort: 6, smartSubsample: true }).toBuffer();
      for (const [ext, buf] of [['avif', avif], ['webp', webp]]) {
        const file = `${key}-${theme}-${w}.${ext}`;
        writeFileSync(join(OUT, file), buf);
        outputs[file] = buf.length;
      }
    }
    source.covers[`${key}-${theme}`] = { source: `SoulMates-Quest-mobile/${rel}`, sourceSha256: sha256(input), appCommit: commit, outputs };
    console.log(`${key}-${theme}:`, Object.entries(outputs).map(([f, b]) => `${f} ${(b / 1024).toFixed(1)} KB`).join(', '));
  }
}
writeFileSync(sourcePath, `${JSON.stringify(source, null, 1)}\n`);
