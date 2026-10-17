import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DARK_FROM, LIGHT_FROM, THEME_SCRIPT, themeForHour } from './theme.ts';

/** Run the inline script at a given local time with a stand-in document and timer. */
function runAt(hour: number, minute = 30) {
  const RealDate = Date;
  const now = new RealDate(2026, 9, 17, hour, minute, 0);
  let theme: string | null = null;
  let delay = -1;
  class FakeDate extends RealDate {
    constructor(...args: unknown[]) {
      if (args.length === 0) super(now.getTime());
      // @ts-expect-error passthrough
      else super(...args);
    }
  }
  const document = { documentElement: { setAttribute: (_: string, v: string) => { theme = v; } } };
  const setTimeout = (_fn: unknown, ms: number) => { delay = ms; };
  new Function('Date', 'document', 'setTimeout', THEME_SCRIPT)(FakeDate, document, setTimeout);
  return { theme, delay, now };
}

test('dark from 18:00 to 08:00, light from 08:00 to 18:00', () => {
  assert.equal(LIGHT_FROM, 8);
  assert.equal(DARK_FROM, 18);
  for (let h = 0; h < 24; h += 1) {
    const expected = h >= 8 && h < 18 ? 'light' : 'dark';
    assert.equal(themeForHour(h), expected, `rule at ${h}:00`);
    assert.equal(runAt(h).theme, expected, `script at ${h}:30`);
  }
  assert.equal(runAt(7, 59).theme, 'dark');
  assert.equal(runAt(8, 0).theme, 'light');
  assert.equal(runAt(17, 59).theme, 'light');
  assert.equal(runAt(18, 0).theme, 'dark');
});

test('the script schedules the next switch at 08:00 or 18:00', () => {
  const min = 60 * 1000;
  assert.equal(runAt(7, 30).delay, 30 * min + 5000);
  assert.equal(runAt(17, 0).delay, 60 * min + 5000);
  assert.equal(runAt(23, 0).delay, 9 * 60 * min + 5000);
});
