/**
 * Screenshots of the internal Oracle review page (/internal/oracle) for
 * design review: every variant at 40, 64 and 120 px, the link and card
 * states, a mid-sweep frame and a hover frame, in light and dark.
 *
 * Needs a running dev server and playwright-core (not a site dependency):
 *   npm run dev -- -p 3311
 *   npm i --prefix /tmp/pw playwright-core
 *   PW_DIR=/tmp/pw node scripts/oracle-screenshots.mjs [baseUrl] [outDir]
 * Uses the installed Google Chrome (channel "chrome").
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(process.env.PW_DIR ? join(process.env.PW_DIR, 'noop.js') : import.meta.url);
const { chromium } = require('playwright-core');

const base = process.argv[2] ?? 'http://localhost:3311';
const out = process.argv[3] ?? join(homedir(), 'Downloads', 'oracle-orb-web');
mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const files = [];
for (const theme of ['light', 'dark']) {
  for (const scale of [1, 2]) {
    const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: scale });
    await page.goto(`${base}/internal/oracle?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200); // entrance sweep has finished and settled
    const shots = await page.$$eval('[data-shot]', (els) => els.map((e) => e.getAttribute('data-shot')));
    for (const shot of shots) {
      if (scale === 2 && !/^(main|ask|connection)-/.test(shot)) continue;
      const file = join(out, `${shot}-${theme}${scale === 2 ? '@2x' : ''}.png`);
      await page.locator(`[data-shot="${shot}"]`).screenshot({ path: file, animations: 'disabled' });
      files.push(file);
    }
    if (scale === 1) {
      await page.screenshot({ path: join(out, `page-${theme}.png`), fullPage: true });
      files.push(join(out, `page-${theme}.png`));
      // Hover frame: glow compression at its tightest (45% of the keyframe).
      await page.hover('[data-shot="link-main"]');
      await page.evaluate(() => document.getAnimations().forEach((a) => { if (a.animationName === 'oracle-compress') { a.pause(); a.currentTime = 99; } }));
      await page.locator('[data-shot="link-main"]').screenshot({ path: join(out, `link-main-hover-${theme}.png`) });
      files.push(join(out, `link-main-hover-${theme}.png`));
      await page.mouse.move(0, 0);
      // Mid-sweep frame of the entrance, on a fresh load.
      await page.reload({ waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = 120 + 320; }));
      await page.locator('[data-shot="main-120"]').screenshot({ path: join(out, `main-120-midsweep-${theme}.png`) });
      files.push(join(out, `main-120-midsweep-${theme}.png`));
    }
    await page.close();
  }
}
// Reduced motion: no sweep at any point.
const rm = await browser.newPage({ viewport: { width: 1200, height: 900 }, reducedMotion: 'reduce' });
await rm.goto(`${base}/internal/oracle?theme=light`, { waitUntil: 'domcontentloaded' });
const running = await rm.evaluate(() => document.getAnimations().filter((a) => a.animationName === 'oracle-sweep').length);
console.log(`reduced motion: ${running} sweep animations (expected 0)`);
await browser.close();
console.log(files.join('\n'));
