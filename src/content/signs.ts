/** Public facts about the twelve signs, synced from the app (lib/readings/signs.ts). */
import SIGN_FACTS_JSON from '@/content/app/signs.json';


export const SIGN_KEYS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;
export type SignKey = (typeof SIGN_KEYS)[number];

export interface SignFacts {
  glyph: string;
  from: [number, number];
  to: [number, number];
  element: 'fire' | 'earth' | 'air' | 'water';
  modality: 'cardinal' | 'fixed' | 'mutable';
  ruler: string;
  traditionalRuler?: string;
}

export const SIGN_FACTS = SIGN_FACTS_JSON as unknown as Record<SignKey, SignFacts>;

export function isSignKey(value: unknown): value is SignKey {
  return typeof value === 'string' && (SIGN_KEYS as readonly string[]).includes(value);
}

