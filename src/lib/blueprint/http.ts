/**
 * HTTP handling for POST /api/blueprint, kept free of Next.js imports and
 * path aliases so `node --test` can exercise it with plain `Request` objects.
 * The clock is injectable so the future-date rule can be tested.
 */
import { buildBlueprint, validateInput } from './blueprint.ts';
import { todayInSofia } from './dates.ts';

/** Bodies larger than this are rejected before JSON parsing. */
export const MAX_BODY_CHARS = 2_000;

export const HTTP_ERRORS = {
  json: 'Request body must be valid JSON.',
  tooLarge: 'Request body is too large.',
  failed: 'Calculation failed. Please try again.',
} as const;

function fail(message: string, status: number): Response {
  return Response.json({ success: false, message }, { status });
}

export async function handleBlueprintRequest(
  req: Request,
  now: () => Date = () => new Date(),
): Promise<Response> {
  let text: string;
  try {
    text = await req.text();
  } catch {
    return fail(HTTP_ERRORS.json, 400);
  }
  if (text.length > MAX_BODY_CHARS) return fail(HTTP_ERRORS.tooLarge, 413);

  let body: unknown;
  try {
    body = JSON.parse(text);
  } catch {
    return fail(HTTP_ERRORS.json, 400);
  }

  const input = validateInput(body, todayInSofia(now()));
  if (!input.ok) return fail(input.error, 400);

  try {
    return Response.json({ success: true, ...buildBlueprint(input.value) });
  } catch (e) {
    // Log only the error, never the submitted name or birth date.
    console.error('Blueprint error:', e instanceof Error ? e.message : 'unknown error');
    return fail(HTTP_ERRORS.failed, 500);
  }
}
