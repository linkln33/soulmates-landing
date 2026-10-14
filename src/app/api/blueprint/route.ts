// Calculators and request handling live in src/lib/blueprint (see README.md
// there for the numerology and date conventions). Nothing submitted here is
// stored. Relative .ts imports (no `@/` alias) let `node --test` import this
// file directly.
import { handleBlueprintRequest } from '../../../lib/blueprint/http.ts';

export async function POST(req: Request): Promise<Response> {
  return handleBlueprintRequest(req);
}
