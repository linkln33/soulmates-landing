/**
 * Encode the two portraits used in the /app page's screen recreations (run
 * from the landing root: `node assets/source/encode-app-page.mjs`; needs the
 * sharp that Next.js installs).
 *
 * Sources: assets/source/app-page/*.webp, square 768 px crops (WebP q95) of two
 * owner-supplied AI-generated portraits of fictional adults (originals and
 * their SHA-256 in SoulMates-Quest-mobile/assets/demo-people/PROVENANCE.md;
 * see assets/source/README.md). Output: public/app-page/<name>-<w>.avif/.webp
 * at 96, 192 and 288 px (1x–3x for the 96 px avatar in the screens).
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const SRC = path.join(ROOT, 'assets/source/app-page');
const OUT = path.join(ROOT, 'public/app-page');
const WIDTHS = [96, 192, 288];
const ART = [
  { src: 'portrait-mila.webp', name: 'mila' },
  { src: 'portrait-martin.webp', name: 'martin' },
];

await mkdir(OUT, { recursive: true });
for (const { src, name } of ART) {
  for (const w of WIDTHS) {
    const img = sharp(path.join(SRC, src)).resize(w, w);
    await img.clone().avif({ quality: 60, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await img.clone().webp({ quality: 82, effort: 6 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }
  console.log(name);
}
