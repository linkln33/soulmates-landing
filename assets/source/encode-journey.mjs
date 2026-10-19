/**
 * Encode the three homepage journey illustrations (run from the landing root:
 * `node assets/source/encode-journey.mjs`; needs the sharp that Next.js
 * installs).
 *
 * Sources are the owner-supplied cut-outs in assets/source/journey/ (originals:
 * SoulMates-Quest-mobile/assets/welcome/). Each one is trimmed to its visible
 * edge, optionally faded out along its bottom so a figure cut by the frame
 * does not end on a hard line, and written to public/home/journey/ as AVIF and
 * WebP at 480/720/960 px wide. Run with --preview to also write PNG contact
 * sheets on the light and dark page backgrounds.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'assets/source/journey');
const OUT = path.join(ROOT, 'public/home/journey');
const WIDTHS = [480, 720, 960];

/** fade: share of the trimmed height, from the bottom, that fades to transparent. */
const ART = [
  { src: 'journey-1-inner-world.png', name: 'inner-world', fade: 0 },
  { src: 'journey-2-notice-connection.png', name: 'notice-connection', fade: 0 },
  { src: 'journey-3-explore-together.png', name: 'explore-together', fade: 0.16 },
];

async function prepare({ src, fade }) {
  // Trim only the transparent margin; the glow's faint outer pixels stay.
  const trimmed = await sharp(path.join(SRC, src)).ensureAlpha().trim({ threshold: 1 }).toBuffer();
  const { data, info } = await sharp(trimmed).raw().toBuffer({ resolveWithObject: true });
  if (fade > 0) {
    const from = Math.round(info.height * (1 - fade));
    for (let y = from; y < info.height; y += 1) {
      const t = (y - from) / (info.height - from);
      const keep = 1 - t * t * (3 - 2 * t); // smoothstep
      for (let x = 0; x < info.width; x += 1) {
        const i = (y * info.width + x) * 4 + 3;
        data[i] = Math.round(data[i] * keep);
      }
    }
  }
  return sharp(data, { raw: info });
}

await mkdir(OUT, { recursive: true });
const preview = process.argv.includes('--preview');

for (const art of ART) {
  const image = await prepare(art);
  const png = await image.png().toBuffer();
  const { width, height } = await sharp(png).metadata();
  for (const w of WIDTHS) {
    const resized = sharp(png).resize({ width: Math.min(w, width) });
    await resized.clone().avif({ quality: 58, effort: 6 }).toFile(path.join(OUT, `${art.name}-${w}.avif`));
    await resized.clone().webp({ quality: 82, effort: 6, alphaQuality: 90 }).toFile(path.join(OUT, `${art.name}-${w}.webp`));
  }
  console.log(art.name, `${width}x${height}`, `ratio ${(width / height).toFixed(4)}`);
  if (preview) {
    for (const [theme, bg] of [['light', '#FFFFFF'], ['dark', '#0B1426']]) {
      await sharp(png).resize({ width: 600 }).flatten({ background: bg }).png().toFile(path.join(OUT, `_preview-${art.name}-${theme}.png`));
    }
  }
}
