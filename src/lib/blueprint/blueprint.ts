/**
 * Pure input validation and reading builder for POST /api/blueprint.
 * Kept free of Next.js imports and path aliases so it can be unit-tested
 * with `node --test`.
 *
 * The Mayan section was removed: it is disabled until a convention
 * (Dreamspell vs. classic count) and reference fixtures are agreed.
 */
import { validateBirthDate, type CalendarDate } from './dates.ts';
import {
  calcExpression,
  calcLifePath,
  calcSoulUrge,
  getCompatibleLifePaths,
  getLifePathInsight,
} from './numerology.ts';
import { getPastLifeArchetype } from './pastLife.ts';
import {
  getCompatibleSigns,
  getComplementaryElement,
  getElement,
  getElementAttraction,
  getModality,
  getSunSign,
} from './sunSign.ts';

export const NAME_MAX_LENGTH = 100;

export const INPUT_ERRORS = {
  body: 'Request body must be a JSON object with "name" and "birthDate".',
  nameType: 'Name must be text.',
  nameEmpty: 'Please enter your name.',
  nameTooLong: `Name must be at most ${NAME_MAX_LENGTH} characters.`,
  birthDateMissing: 'Please enter your birth date.',
} as const;

export interface BlueprintInput {
  name: string;
  birthDate: CalendarDate;
}

export type InputValidation =
  | { ok: true; value: BlueprintInput }
  | { ok: false; error: string };

export function validateInput(body: unknown, latestAllowedDate: string): InputValidation {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, error: INPUT_ERRORS.body };
  }
  const { name, birthDate } = body as Record<string, unknown>;

  if (typeof name !== 'string') {
    return { ok: false, error: name === undefined || name === null ? INPUT_ERRORS.nameEmpty : INPUT_ERRORS.nameType };
  }
  const trimmed = name.trim();
  const length = Array.from(trimmed).length;
  if (length === 0) return { ok: false, error: INPUT_ERRORS.nameEmpty };
  if (length > NAME_MAX_LENGTH) return { ok: false, error: INPUT_ERRORS.nameTooLong };

  if (birthDate === undefined || birthDate === null || birthDate === '') {
    return { ok: false, error: INPUT_ERRORS.birthDateMissing };
  }
  const date = validateBirthDate(birthDate, latestAllowedDate);
  if (!date.ok) return { ok: false, error: date.error };

  return { ok: true, value: { name: trimmed, birthDate: date.date } };
}

export type DetailValue = string | number | null;

export interface BlueprintSection {
  key: 'numerology' | 'sunSign' | 'pastLife';
  emoji: string;
  title: string;
  summary: string;
  details: Record<string, DetailValue>;
  notes: string[];
}

export interface BlueprintResult {
  blueprint: { name: string; title: string; sections: BlueprintSection[] };
  systemsUsed: BlueprintSection['key'][];
}

export const NAME_NUMBERS_NOTE =
  'Expression and soul urge numbers could not be calculated for the characters entered. They use Latin (a–z, including accented letters) and Bulgarian Cyrillic letters only.';
export const SOUL_URGE_NOTE =
  'Soul urge could not be calculated because the name has no vowels we count (Latin a e i o u y; Bulgarian а е и о у ъ ю я).';

export function buildBlueprint(input: BlueprintInput): BlueprintResult {
  const { name, birthDate } = input;
  const lifePath = calcLifePath(birthDate.year, birthDate.month, birthDate.day);
  const expression = calcExpression(name);
  const soulUrge = calcSoulUrge(name);

  const sunSign = getSunSign(birthDate.month, birthDate.day);
  if (!sunSign) throw new RangeError(`No sun sign for ${birthDate.iso}`);
  const element = getElement(sunSign);
  const modality = getModality(sunSign);
  const complementary = getComplementaryElement(element);
  const compatibleSigns = getCompatibleSigns(sunSign);
  const pastLife = getPastLifeArchetype(lifePath, element);

  const numerologyNotes: string[] = [];
  if (expression === null) numerologyNotes.push(NAME_NUMBERS_NOTE);
  else if (soulUrge === null) numerologyNotes.push(SOUL_URGE_NOTE);

  const sections: BlueprintSection[] = [
    {
      key: 'numerology',
      emoji: '🔢',
      title: 'Numerology',
      summary: getLifePathInsight(lifePath),
      details: {
        lifePath,
        expression,
        soulUrge,
        classicPairings: getCompatibleLifePaths(lifePath).join(', '),
      },
      notes: numerologyNotes,
    },
    {
      key: 'sunSign',
      emoji: '♈',
      title: 'Sun Sign & Element',
      summary: `Your sun sign is ${sunSign}, a ${element} sign with ${modality} modality. Traditional astrology pairs ${element} with ${complementary}: ${getElementAttraction(element)}. Signs often described as compatible: ${compatibleSigns.slice(0, 2).join(' & ')}.`,
      details: {
        sunSign,
        element,
        modality,
        complementaryElement: complementary,
        compatibleSigns: compatibleSigns.join(', '),
      },
      notes: [],
    },
    {
      key: 'pastLife',
      emoji: '🕊️',
      title: 'Symbolic Past-Life Archetype',
      summary: `Based on your life path number and your sun sign's element, your symbolic archetype is ${pastLife.archetype}. Its gift: ${pastLife.gift.toLowerCase()}. Its lesson: ${pastLife.lesson.toLowerCase()}. This is a storytelling image for reflection, not a claim about a past life.`,
      details: {
        archetype: pastLife.archetype,
        gift: pastLife.gift,
        lesson: pastLife.lesson,
      },
      notes: [],
    },
  ];

  return {
    blueprint: { name, title: `${name}'s free reading`, sections },
    systemsUsed: sections.map((s) => s.key),
  };
}
