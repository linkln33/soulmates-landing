// HTTP-level behaviour of POST /api/blueprint. Next route handlers are plain
// functions of a Request, so they are called directly with `new Request(...)`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { POST } from './route.ts';
import { HTTP_ERRORS, MAX_BODY_CHARS, handleBlueprintRequest } from '../../../lib/blueprint/http.ts';
import { DATE_ERRORS, futureDateError } from '../../../lib/blueprint/dates.ts';
import { INPUT_ERRORS } from '../../../lib/blueprint/blueprint.ts';

const ENDPOINT = 'http://localhost/api/blueprint';

function post(body: string): Request {
  return new Request(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
}
function postJson(value: unknown): Request {
  return post(JSON.stringify(value));
}
async function call(req: Request, handler: (r: Request) => Promise<Response> = POST) {
  const res = await handler(req);
  return { status: res.status, type: res.headers.get('content-type') ?? '', json: (await res.json()) as Record<string, unknown> };
}

test('200: returns the three-section reading and nothing else', async () => {
  const r = await call(postJson({ name: 'Мария Иванова', birthDate: '1990-05-17' }));
  assert.equal(r.status, 200);
  assert.match(r.type, /application\/json/);
  assert.deepEqual(Object.keys(r.json).sort(), ['blueprint', 'success', 'systemsUsed']);
  assert.equal(r.json.success, true);
  assert.deepEqual(r.json.systemsUsed, ['numerology', 'sunSign', 'pastLife']);

  const text = JSON.stringify(r.json);
  assert.doesNotMatch(text, /confidence/i, 'no hard-coded confidence');
  assert.doesNotMatch(text, /mayan|tzolkin|kin\b/i, 'Mayan is disabled');

  const blueprint = r.json.blueprint as { name: string; sections: { key: string; details: Record<string, unknown> }[] };
  assert.equal(blueprint.name, 'Мария Иванова');
  const [num, sun] = blueprint.sections;
  // Hand-computed in numerology.test.ts: expression 8, soul urge 3.
  // Life path 1990-05-17: 5 + 8 (17) + 1 (1990 -> 19 -> 10 -> 1) = 14 -> 5.
  assert.deepEqual(
    { lifePath: num.details.lifePath, expression: num.details.expression, soulUrge: num.details.soulUrge },
    { lifePath: 5, expression: 8, soulUrge: 3 },
  );
  assert.equal(sun.details.sunSign, 'Taurus');
});

test('400: dates that do not exist, or are before 1900', async () => {
  for (const [birthDate, error] of [
    ['1995-02-31', DATE_ERRORS.notReal],
    ['2023-02-29', DATE_ERRORS.notReal],
    ['17/05/1990', DATE_ERRORS.format],
    ['1899-12-31', DATE_ERRORS.tooEarly],
  ] as const) {
    const r = await call(postJson({ name: 'Ana', birthDate }));
    assert.equal(r.status, 400, birthDate);
    assert.deepEqual(r.json, { success: false, message: error }, birthDate);
  }
  const leap = await call(postJson({ name: 'Ana', birthDate: '2024-02-29' }));
  assert.equal(leap.status, 200);
});

test('400: far-future date through the real route (real clock)', async () => {
  const r = await call(postJson({ name: 'Ana', birthDate: '2999-01-01' }));
  assert.equal(r.status, 400);
  assert.equal(r.json.success, false);
  assert.match(String(r.json.message), /cannot be in the future/);
});

test('future-date rule uses today in Europe/Sofia, with an injected clock', async () => {
  // 2026-10-14 21:30 UTC is 00:30 on 2026-10-15 in Sofia (EEST, UTC+3).
  const clock = () => new Date(Date.UTC(2026, 9, 14, 21, 30));
  const handler = (req: Request) => handleBlueprintRequest(req, clock);

  const today = await call(postJson({ name: 'Ana', birthDate: '2026-10-15' }), handler);
  assert.equal(today.status, 200, "Sofia's today is accepted even though it is still the 14th in UTC");

  const tomorrow = await call(postJson({ name: 'Ana', birthDate: '2026-10-16' }), handler);
  assert.equal(tomorrow.status, 400, 'no +1 day leniency');
  assert.deepEqual(tomorrow.json, { success: false, message: futureDateError('2026-10-15') });

  // One minute before Sofia midnight, the 15th is still in the future.
  const early = (req: Request) => handleBlueprintRequest(req, () => new Date(Date.UTC(2026, 9, 14, 20, 59)));
  assert.equal((await call(postJson({ name: 'Ana', birthDate: '2026-10-15' }), early)).status, 400);
});

test('400: malformed JSON and non-object bodies', async () => {
  for (const body of ['{"name": "Ana", ', 'not json', '']) {
    const r = await call(post(body));
    assert.equal(r.status, 400, JSON.stringify(body));
    assert.deepEqual(r.json, { success: false, message: HTTP_ERRORS.json });
  }
  for (const body of ['null', '[]', '"Ana"', '42']) {
    const r = await call(post(body));
    assert.equal(r.status, 400, body);
    assert.deepEqual(r.json, { success: false, message: INPUT_ERRORS.body });
  }
});

test('400/413: oversized names and bodies', async () => {
  const ok = await call(postJson({ name: 'a'.repeat(100), birthDate: '1990-01-01' }));
  assert.equal(ok.status, 200, '100 characters is the maximum');

  const long = await call(postJson({ name: 'a'.repeat(101), birthDate: '1990-01-01' }));
  assert.equal(long.status, 400);
  assert.deepEqual(long.json, { success: false, message: INPUT_ERRORS.nameTooLong });

  const huge = await call(postJson({ name: 'a'.repeat(MAX_BODY_CHARS), birthDate: '1990-01-01' }));
  assert.equal(huge.status, 413, 'rejected before JSON parsing');
  assert.deepEqual(huge.json, { success: false, message: HTTP_ERRORS.tooLarge });
});

test('400: wrong types and missing fields', async () => {
  assert.deepEqual((await call(postJson({ name: 123, birthDate: '1990-01-01' }))).json, { success: false, message: INPUT_ERRORS.nameType });
  assert.deepEqual((await call(postJson({ birthDate: '1990-01-01' }))).json, { success: false, message: INPUT_ERRORS.nameEmpty });
  assert.deepEqual((await call(postJson({ name: 'Ana' }))).json, { success: false, message: INPUT_ERRORS.birthDateMissing });
});
