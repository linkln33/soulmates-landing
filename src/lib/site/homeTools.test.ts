import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { COVER_FORMATS, COVER_THEMES, COVER_WIDTHS, HOME_TOOLS, coverFile } from './homeTools.ts';

const ROOT = join(import.meta.dirname, '../../..');
const PUBLIC = join(ROOT, 'public');

test('every painted cover has light and dark files at 1x and 2x, recorded in SOURCE.json', () => {
  const source: { note: string; covers: Record<string, { outputs: Record<string, number> }> } = JSON.parse(readFileSync(join(PUBLIC, 'app-content/covers/SOURCE.json'), 'utf8'));
  assert.match(source.note, /owner-supplied artwork, copied from the mobile assets\/cards/);
  for (const tool of HOME_TOOLS) {
    if (!tool.cover) {
      assert.ok(existsSync(join(PUBLIC, `app-content/illustrations/${tool.art}.svg`)), tool.art);
      continue;
    }
    for (const theme of COVER_THEMES) {
      const entry: { outputs: Record<string, number> } | undefined = source.covers[`${tool.cover}-${theme}`];
      assert.ok(entry, `SOURCE.json entry for ${tool.cover}-${theme}`);
      for (const w of COVER_WIDTHS) {
        for (const f of COVER_FORMATS) {
          const file = coverFile(tool.cover, theme, w, f);
          assert.ok(existsSync(join(PUBLIC, file)), file);
          assert.equal(readFileSync(join(PUBLIC, file)).length, entry!.outputs[file.split('/').pop()!], `${file} bytes`);
        }
      }
    }
  }
});

test('the four tiles stay in order', () => {
  assert.deepEqual(HOME_TOOLS.map((t) => t.key), ['horoscope', 'tarot', 'numbers', 'moon']);
});
