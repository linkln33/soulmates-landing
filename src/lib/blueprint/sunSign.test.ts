import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getElement, getSunSign } from './sunSign.ts';

test('sign boundaries follow the fixed cut-off table', () => {
  const cases: [number, number, string][] = [
    [1, 1, 'Capricorn'], [1, 19, 'Capricorn'], [1, 20, 'Aquarius'],
    [2, 18, 'Aquarius'], [2, 19, 'Pisces'], [2, 29, 'Pisces'],
    [3, 20, 'Pisces'], [3, 21, 'Aries'],
    [4, 19, 'Aries'], [4, 20, 'Taurus'],
    [5, 20, 'Taurus'], [5, 21, 'Gemini'],
    [6, 20, 'Gemini'], [6, 21, 'Cancer'],
    [7, 22, 'Cancer'], [7, 23, 'Leo'],
    [8, 22, 'Leo'], [8, 23, 'Virgo'],
    [9, 22, 'Virgo'], [9, 23, 'Libra'],
    [10, 22, 'Libra'], [10, 23, 'Scorpio'],
    [11, 21, 'Scorpio'], [11, 22, 'Sagittarius'],
    [12, 21, 'Sagittarius'], [12, 22, 'Capricorn'], [12, 31, 'Capricorn'],
  ];
  for (const [m, d, sign] of cases) assert.equal(getSunSign(m, d), sign, `${m}-${d}`);
});

test('invalid month/day returns null instead of Pisces', () => {
  for (const [m, d] of [[0, 0], [13, 1], [0, 10], [2, 30], [4, 31], [6, 0], [1, 32], [1.5, 2], [NaN, 1]]) {
    assert.equal(getSunSign(m, d), null, `${m}-${d}`);
  }
});

test('element lookup', () => {
  assert.equal(getElement('Leo'), 'Fire');
  assert.equal(getElement('Pisces'), 'Water');
});
