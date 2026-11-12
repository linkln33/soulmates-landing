import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import qrcode from 'qrcode-generator';
import jsQR from 'jsqr';
import { QR_QUIET_ZONE, qrMatrix, qrSvgPath, referralWebUrl } from './qr.ts';

test('the QR link is the canonical invitation URL only: www host, no language, no query', () => {
  assert.equal(referralWebUrl('ivan-7k3m9p'), 'https://www.soulmates.quest/r/ivan-7k3m9p');
  assert.equal(referralWebUrl('  ABCD2345 '), 'https://www.soulmates.quest/r/abcd2345');
  for (const bad of ['abc', 'ab_cd', 'abcd%2Fx', 'abcd?x=1', 'abcd2345#a', undefined]) assert.equal(referralWebUrl(bad), null, String(bad));
});

test('the matrix is the encoder output for exactly that URL', () => {
  const url = 'https://www.soulmates.quest/r/ivan-7k3m9p';
  const ref = qrcode(0, 'M');
  ref.addData(url, 'Byte');
  ref.make();
  const grid = qrMatrix(url);
  assert.equal(grid.length, ref.getModuleCount());
  grid.forEach((row, r) => row.forEach((dark, c) => assert.equal(dark, ref.isDark(r, c))));
  // A different code gives a different picture.
  assert.notDeepEqual(qrMatrix('https://www.soulmates.quest/r/ivan-7k3m9q'), grid);
});

test('the SVG path draws one square per dark module, inside the quiet zone', () => {
  const url = 'https://www.soulmates.quest/r/abcd2345';
  const grid = qrMatrix(url);
  const { size, d } = qrSvgPath(url);
  assert.equal(size, grid.length + 2 * QR_QUIET_ZONE);
  const squares = [...d.matchAll(/M(\d+) (\d+)h1v1h-1z/g)];
  assert.equal(squares.length, grid.flat().filter(Boolean).length);
  assert.equal(squares.map((m) => m[0]).join(''), d);
  for (const [, x, y] of squares) {
    assert.ok(grid[Number(y) - QR_QUIET_ZONE][Number(x) - QR_QUIET_ZONE]);
  }
});

test('the referral QR is a server component fed only by referralWebUrl', () => {
  const source = readFileSync(new URL('../../components/invite/ReferralQr.tsx', import.meta.url), 'utf8');
  assert.ok(!/['"]use client['"]/.test(source));
  assert.match(source, /referralWebUrl\(code\)/);
  assert.match(source, /qrSvgPath\(url\)/);
});

/** RGBA pixels of the drawn code: white background, quiet zone, `scale` pixels per module. */
function render(url: string, scale = 4) {
  const grid = qrMatrix(url);
  const side = (grid.length + 2 * QR_QUIET_ZONE) * scale;
  const data = new Uint8ClampedArray(side * side * 4).fill(255);
  grid.forEach((row, r) => row.forEach((dark, c) => {
    if (!dark) return;
    for (let y = 0; y < scale; y++) {
      for (let x = 0; x < scale; x++) {
        const i = (((r + QR_QUIET_ZONE) * scale + y) * side + (c + QR_QUIET_ZONE) * scale + x) * 4;
        data[i] = data[i + 1] = data[i + 2] = 0;
      }
    }
  }));
  return { data, side };
}

test('a decoder reads back exactly the invitation URL', () => {
  for (const code of ['abcd2345', 'ivan-7k3m9p', 'a'.repeat(32), '  MARIA-X1  ']) {
    const url = referralWebUrl(code)!;
    const { data, side } = render(url);
    const decoded = jsQR(data, side, side);
    assert.ok(decoded, code);
    assert.equal(decoded.data, `https://www.soulmates.quest/r/${code.trim().toLowerCase()}`);
  }
});
