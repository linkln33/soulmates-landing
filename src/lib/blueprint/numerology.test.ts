import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  BULGARIAN_ALPHABET,
  calcExpression,
  calcLifePath,
  calcSoulUrge,
  reduceNumber,
  scoreChar,
} from './numerology.ts';

test('Bulgarian alphabet has 30 letters and cycles 1-9', () => {
  assert.equal(Array.from(BULGARIAN_ALPHABET).length, 30);
  assert.equal(scoreChar('а')?.value, 1);
  assert.equal(scoreChar('и')?.value, 9);
  assert.equal(scoreChar('й')?.value, 1); // position 10, not stripped to и
  assert.equal(scoreChar('ъ')?.value, 9); // position 27
  assert.equal(scoreChar('ь')?.value, 1); // position 28
  assert.equal(scoreChar('я')?.value, 3); // position 30
  assert.equal(scoreChar('Я')?.value, 3); // upper case
});

test('Russian/Ukrainian-only letters and ѝ are ignored', () => {
  for (const ch of ['ё', 'ы', 'э', 'і', 'ї', 'є', 'ґ', 'ѝ']) assert.equal(scoreChar(ch), null, ch);
});

test('accented Latin letters fold to their base letter', () => {
  assert.deepEqual(scoreChar('é'), scoreChar('e'));
  assert.deepEqual(scoreChar('ë'), scoreChar('e'));
  assert.deepEqual(scoreChar('ñ'), scoreChar('n'));
  // Decomposed input (e + combining acute) behaves the same.
  assert.deepEqual(scoreChar('é'.normalize('NFC')), scoreChar('e'));
  assert.equal(scoreChar('ß'), null);
});

test('John Smith (Pythagorean): expression 8, soul urge 6', () => {
  // J1 O6 H8 N5 = 20; S1 M4 I9 T2 H8 = 24; 44 -> 8. Vowels O6 I9 = 15 -> 6.
  assert.equal(calcExpression('John Smith'), 8);
  assert.equal(calcSoulUrge('John Smith'), 6);
});

test('Мария Иванова: non-trivial expression 8, soul urge 3', () => {
  // М4 а1 р8 и9 я3 = 25; И9 в3 а1 н5 о6 в3 а1 = 28; 53 -> 8.
  // Vowels а1 и9 я3 = 13; И9 а1 о6 а1 = 17; 30 -> 3.
  assert.equal(calcExpression('Мария Иванова'), 8);
  assert.equal(calcSoulUrge('Мария Иванова'), 3);
});

test('Георги: expression 1 (a real sum, 37 -> 10 -> 1), soul urge 3', () => {
  // Г4 е6 о6 р8 г4 и9 = 37 -> 10 -> 1. Vowels е6 о6 и9 = 21 -> 3.
  assert.equal(calcExpression('Георги'), 1);
  assert.equal(calcSoulUrge('Георги'), 3);
});

test('María José: expression 1, soul urge keeps master 22', () => {
  // m4 a1 r9 i9 a1 = 24; j1 o6 s1 e5 = 13; 37 -> 10 -> 1.
  // Vowels a1 i9 a1 o6 e5 = 22 (master).
  assert.equal(calcExpression('María José'), 1);
  assert.equal(calcSoulUrge('María José'), 22);
});

test('Zoë: expression 1, soul urge keeps master 11', () => {
  // z8 o6 e5 = 19 -> 10 -> 1. Vowels o6 e5 = 11 (master).
  assert.equal(calcExpression('Zoë'), 1);
  assert.equal(calcSoulUrge('Zoë'), 11);
});

test('mixed script "Ana Мария": each letter by its own table', () => {
  // a1 n5 a1 = 7; Мария = 25; 32 -> 5. Vowels a1 a1 = 2; а1 и9 я3 = 13; 15 -> 6.
  assert.equal(calcExpression('Ana Мария'), 5);
  assert.equal(calcSoulUrge('Ana Мария'), 6);
});

test('no countable letters -> null, never a fake 1', () => {
  for (const name of ['李雷', '12345', '', '   ', '---', 'Ёыэ']) {
    assert.equal(calcExpression(name), null, name);
    assert.equal(calcSoulUrge(name), null, name);
  }
});

test('letters but no counted vowels -> soul urge null, expression computed', () => {
  // B2 R9 N5 = 16 -> 7
  assert.equal(calcExpression('Brn'), 7);
  assert.equal(calcSoulUrge('Brn'), null);
  // Bulgarian consonants only: б2 р8 = 10 -> 1
  assert.equal(calcExpression('бр'), 1);
  assert.equal(calcSoulUrge('бр'), null);
});

test('y is counted as a vowel', () => {
  // L3 Y7 N5 N5 = 20 -> 2; vowel Y7 -> 7
  assert.equal(calcExpression('Lynn'), 2);
  assert.equal(calcSoulUrge('Lynn'), 7);
});

test('Bulgarian vowels include ъ ю я', () => {
  // ъ9 ю2 я3 = 14 -> 5
  assert.equal(calcSoulUrge('ъюя'), 5);
});

test('very long names still reduce correctly', () => {
  const v = calcExpression('a'.repeat(100));
  assert.equal(v, 1); // 100 -> 1
});

test('reduceNumber keeps masters when a step lands on them', () => {
  assert.equal(reduceNumber(0), 0);
  assert.equal(reduceNumber(9), 9);
  assert.equal(reduceNumber(10), 1);
  assert.equal(reduceNumber(11), 11);
  assert.equal(reduceNumber(29), 11);
  assert.equal(reduceNumber(38), 11);
  assert.equal(reduceNumber(22), 22);
  assert.equal(reduceNumber(33), 33);
  assert.equal(reduceNumber(66), 3); // 66 -> 12 -> 3
  assert.equal(reduceNumber(1996), 7); // 25 -> 7
  assert.throws(() => reduceNumber(-1));
});

test('life path: reduce month, day, year separately, sum, reduce (masters kept)', () => {
  // 1996-02-29: 2 + 11 (29 -> 11) + 7 (1996 -> 25 -> 7) = 20 -> 2
  assert.equal(calcLifePath(1996, 2, 29), 2);
  // 1990-01-01: 1 + 1 + 1 (1990 -> 19 -> 10 -> 1) = 3
  assert.equal(calcLifePath(1990, 1, 1), 3);
  // 2009-11-11: 11 + 11 + 11 (2009 -> 11) = 33
  assert.equal(calcLifePath(2009, 11, 11), 33);
  // 1985-11-04: 11 + 4 + 5 (1985 -> 23 -> 5) = 20 -> 2
  assert.equal(calcLifePath(1985, 11, 4), 2);
  // 1975-12-27: 3 (12) + 9 (27) + 22 (1975 -> 22, master kept) = 34 -> 7
  assert.equal(calcLifePath(1975, 12, 27), 7);
});
