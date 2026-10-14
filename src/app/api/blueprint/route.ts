import { NextRequest, NextResponse } from 'next/server';
import { buildBlueprint, validateInput } from '@/lib/blueprint/blueprint';
import { serverLatestAllowedDate } from '@/lib/blueprint/dates';

// Calculators live in src/lib/blueprint (see README.md there for the
// numerology and date conventions). Nothing submitted here is stored.

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const input = validateInput(body, serverLatestAllowedDate());
  if (!input.ok) {
    return NextResponse.json({ success: false, message: input.error }, { status: 400 });
  }

  try {
    return NextResponse.json({ success: true, ...buildBlueprint(input.value) });
  } catch (e) {
    // Log only the error, never the submitted name or birth date.
    console.error('Blueprint error:', e instanceof Error ? e.message : 'unknown error');
    return NextResponse.json(
      { success: false, message: 'Calculation failed. Please try again.' },
      { status: 500 },
    );
  }
}
