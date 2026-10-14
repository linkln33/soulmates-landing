/**
 * Symbolic "past-life archetype": a fixed lookup keyed by sun-sign element
 * and life path number. It is a storytelling image for reflection, not a
 * claim about any actual past life, and it is not calculated from anything
 * beyond those two inputs.
 */
import type { Element } from './sunSign.ts';

export interface PastLifeArchetype {
  archetype: string;
  gift: string;
  lesson: string;
}

const ARCHETYPES: Record<string, PastLifeArchetype> = {
  'Fire-1': { archetype: 'The Warrior King', gift: 'Fearless leadership', lesson: 'Learning to surrender' },
  'Fire-3': { archetype: 'The Court Jester', gift: 'Bringing light to darkness', lesson: 'Depth over performance' },
  'Fire-5': { archetype: 'The Explorer', gift: 'Courage to venture into the unknown', lesson: 'Commitment in freedom' },
  'Fire-7': { archetype: 'The Fire Mystic', gift: 'Visionary sight', lesson: 'Grounding your visions' },
  'Fire-8': { archetype: 'The Conqueror', gift: 'Unstoppable will', lesson: 'Power in service of love' },
  'Fire-9': { archetype: 'The Crusader', gift: 'Righteous passion', lesson: 'Discernment in devotion' },
  'Earth-2': { archetype: 'The Keeper of the Sacred', gift: 'Tending what matters', lesson: 'Receiving as well as giving' },
  'Earth-4': { archetype: 'The Master Craftsperson', gift: 'Building to last', lesson: 'Flexibility alongside structure' },
  'Earth-6': { archetype: 'The Healer', gift: 'Restoring harmony', lesson: 'Caring for yourself first' },
  'Earth-8': { archetype: 'The Merchant Prince/Princess', gift: 'Creating abundance', lesson: 'Power in service of love' },
  'Air-1': { archetype: 'The Visionary', gift: 'Seeing what others cannot', lesson: 'Listening as deeply as speaking' },
  'Air-3': { archetype: 'The Storyteller', gift: 'Holding communities through story', lesson: 'Honoring silence' },
  'Air-5': { archetype: 'The Messenger', gift: 'Carrying wisdom between worlds', lesson: 'Stillness as wisdom' },
  'Air-7': { archetype: 'The Philosopher', gift: 'Illuminating truth', lesson: 'Living the wisdom you teach' },
  'Air-11': { archetype: 'The Oracle', gift: 'Channeling higher realms', lesson: 'Grounding your gifts in the body' },
  'Water-2': { archetype: 'The Empath', gift: 'Feeling the unseen', lesson: 'Boundaries as self-love' },
  'Water-4': { archetype: 'The Keeper of Souls', gift: 'Protecting what is sacred', lesson: 'Release what no longer serves' },
  'Water-6': { archetype: 'The Priestess / Priest', gift: 'Holding sacred space', lesson: 'Surrendering control' },
  'Water-9': { archetype: 'The Wandering Saint', gift: 'Universal compassion', lesson: 'Rooting love in one place' },
  'Water-22': { archetype: 'The World Architect', gift: 'Dreaming new systems into being', lesson: 'Trusting others to help build' },
};

const DEFAULT_ARCHETYPE: PastLifeArchetype = {
  archetype: 'The Seeker',
  gift: 'Innate spiritual curiosity',
  lesson: 'Trusting the journey',
};

export function getPastLifeArchetype(lifePath: number, element: Element): PastLifeArchetype {
  return ARCHETYPES[`${element}-${lifePath}`] ?? DEFAULT_ARCHETYPE;
}
