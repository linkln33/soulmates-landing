import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  INPUT_ERRORS,
  NAME_NUMBERS_NOTE,
  SOUL_URGE_NOTE,
  buildBlueprint,
  validateInput,
} from './blueprint.ts';
import { DATE_ERRORS } from './dates.ts';

const LATEST = '2026-10-15';

function ok(body: unknown) {
  const r = validateInput(body, LATEST);
  if (!r.ok) throw new Error(`expected ok, got: ${r.error}`);
  return r.value;
}

test('validateInput accepts and trims a valid body', () => {
  const v = ok({ name: '  Мария Иванова ', birthDate: '1990-05-17' });
  assert.equal(v.name, 'Мария Иванова');
  assert.deepEqual(v.birthDate, { year: 1990, month: 5, day: 17, iso: '1990-05-17' });
});

test('validateInput rejects non-object bodies', () => {
  for (const b of [null, 'x', 42, [], true]) {
    assert.deepEqual(validateInput(b, LATEST), { ok: false, error: INPUT_ERRORS.body });
  }
});

test('validateInput name rules', () => {
  const date = '1990-01-01';
  assert.deepEqual(validateInput({ birthDate: date }, LATEST), { ok: false, error: INPUT_ERRORS.nameEmpty });
  assert.deepEqual(validateInput({ name: '   ', birthDate: date }, LATEST), { ok: false, error: INPUT_ERRORS.nameEmpty });
  assert.deepEqual(validateInput({ name: 123, birthDate: date }, LATEST), { ok: false, error: INPUT_ERRORS.nameType });
  assert.deepEqual(validateInput({ name: ['a'], birthDate: date }, LATEST), { ok: false, error: INPUT_ERRORS.nameType });
  assert.equal(validateInput({ name: 'a'.repeat(100), birthDate: date }, LATEST).ok, true);
  assert.deepEqual(validateInput({ name: 'a'.repeat(101), birthDate: date }, LATEST), { ok: false, error: INPUT_ERRORS.nameTooLong });
  // Length counts code points, so 100 astral characters are allowed.
  assert.equal(validateInput({ name: '😀'.repeat(100), birthDate: date }, LATEST).ok, true);
});

test('validateInput birth date rules', () => {
  const name = 'Ana';
  assert.deepEqual(validateInput({ name }, LATEST), { ok: false, error: INPUT_ERRORS.birthDateMissing });
  assert.deepEqual(validateInput({ name, birthDate: '1995-02-31' }, LATEST), { ok: false, error: DATE_ERRORS.notReal });
  assert.deepEqual(validateInput({ name, birthDate: '2023-02-29' }, LATEST), { ok: false, error: DATE_ERRORS.notReal });
  assert.deepEqual(validateInput({ name, birthDate: '2026-10-16' }, LATEST), { ok: false, error: DATE_ERRORS.future });
  assert.deepEqual(validateInput({ name, birthDate: 19900101 }, LATEST), { ok: false, error: DATE_ERRORS.format });
  assert.equal(validateInput({ name, birthDate: '2024-02-29' }, LATEST).ok, true);
});

test('buildBlueprint: no confidence, no Mayan, three honest sections', () => {
  const r = buildBlueprint(ok({ name: 'Мария Иванова', birthDate: '1990-05-17' }));
  assert.deepEqual(r.systemsUsed, ['numerology', 'sunSign', 'pastLife']);
  const json = JSON.stringify(r);
  assert.ok(!/confidence/i.test(json));
  assert.ok(!/mayan|kin/i.test(json));
  const num = r.blueprint.sections[0];
  assert.equal(num.details.expression, 8);
  assert.equal(num.details.soulUrge, 3);
  assert.deepEqual(num.notes, []);
  assert.equal(r.blueprint.sections[1].details.sunSign, 'Taurus');
});

test('buildBlueprint: uncountable name gives null numbers and a note', () => {
  const r = buildBlueprint(ok({ name: '李雷', birthDate: '1990-05-17' }));
  const num = r.blueprint.sections[0];
  assert.equal(num.details.expression, null);
  assert.equal(num.details.soulUrge, null);
  assert.deepEqual(num.notes, [NAME_NUMBERS_NOTE]);
  assert.equal(typeof num.details.lifePath, 'number');
});

test('buildBlueprint: no vowels gives soul-urge note only', () => {
  const r = buildBlueprint(ok({ name: 'Brn', birthDate: '1990-05-17' }));
  assert.deepEqual(r.blueprint.sections[0].notes, [SOUL_URGE_NOTE]);
});

test('buildBlueprint works for every day of a leap year', () => {
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= new Date(Date.UTC(2024, m, 0)).getUTCDate(); d++) {
      const iso = `2024-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      assert.doesNotThrow(() => buildBlueprint(ok({ name: 'Test', birthDate: iso })), iso);
    }
  }
});
