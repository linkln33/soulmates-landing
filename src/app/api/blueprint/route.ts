import { NextRequest, NextResponse } from 'next/server';

// ── Numerology ──────────────────────────────────────────────

function reduceToSingleDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num).split('').reduce((s, d) => s + parseInt(d, 10), 0);
  }
  return num;
}

function calcLifePath(birthDate: string): number {
  const [year, month, day] = birthDate.split('-').map(Number);
  const reduced = reduceToSingleDigit(year) + reduceToSingleDigit(month) + reduceToSingleDigit(day);
  if (reduced === 11 || reduced === 22 || reduced === 33) return reduced;
  return reduceToSingleDigit(reduced);
}

function calcExpression(name: string): number {
  const map: Record<string, number> = {
    a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
    j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
    s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
  };
  const sum = name.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (map[c] || 0), 0);
  return reduceToSingleDigit(sum) || 1;
}

function calcSoulUrge(name: string): number {
  const vMap: Record<string, number> = { a:1, e:5, i:9, o:6, u:3, y:7 };
  const sum = name.toLowerCase().replace(/[^a-z]/g, '').split('').reduce((s, c) => s + (vMap[c] || 0), 0);
  return reduceToSingleDigit(sum) || 1;
}

// ── Astrology ────────────────────────────────────────────────

function getSunSign(birthDate: string): string {
  const [, mm, dd] = birthDate.split('-').map(Number);
  if ((mm === 3 && dd >= 21) || (mm === 4 && dd <= 19)) return 'Aries';
  if ((mm === 4 && dd >= 20) || (mm === 5 && dd <= 20)) return 'Taurus';
  if ((mm === 5 && dd >= 21) || (mm === 6 && dd <= 20)) return 'Gemini';
  if ((mm === 6 && dd >= 21) || (mm === 7 && dd <= 22)) return 'Cancer';
  if ((mm === 7 && dd >= 23) || (mm === 8 && dd <= 22)) return 'Leo';
  if ((mm === 8 && dd >= 23) || (mm === 9 && dd <= 22)) return 'Virgo';
  if ((mm === 9 && dd >= 23) || (mm === 10 && dd <= 22)) return 'Libra';
  if ((mm === 10 && dd >= 23) || (mm === 11 && dd <= 21)) return 'Scorpio';
  if ((mm === 11 && dd >= 22) || (mm === 12 && dd <= 21)) return 'Sagittarius';
  if ((mm === 12 && dd >= 22) || (mm === 1 && dd <= 19)) return 'Capricorn';
  if ((mm === 1 && dd >= 20) || (mm === 2 && dd <= 18)) return 'Aquarius';
  return 'Pisces';
}

function getElement(sign: string): string {
  const map: Record<string, string> = {
    Aries:'Fire',Leo:'Fire',Sagittarius:'Fire',
    Taurus:'Earth',Virgo:'Earth',Capricorn:'Earth',
    Gemini:'Air',Libra:'Air',Aquarius:'Air',
    Cancer:'Water',Scorpio:'Water',Pisces:'Water',
  };
  return map[sign] || 'Fire';
}

function getModality(sign: string): string {
  const map: Record<string, string> = {
    Aries:'Cardinal',Cancer:'Cardinal',Libra:'Cardinal',Capricorn:'Cardinal',
    Taurus:'Fixed',Leo:'Fixed',Scorpio:'Fixed',Aquarius:'Fixed',
    Gemini:'Mutable',Virgo:'Mutable',Sagittarius:'Mutable',Pisces:'Mutable',
  };
  return map[sign] || 'Cardinal';
}

function getCompatibleSigns(sign: string): string[] {
  const map: Record<string, string[]> = {
    Aries:['Leo','Sagittarius','Gemini','Aquarius'],
    Taurus:['Virgo','Capricorn','Cancer','Pisces'],
    Gemini:['Libra','Aquarius','Aries','Leo'],
    Cancer:['Scorpio','Pisces','Taurus','Virgo'],
    Leo:['Aries','Sagittarius','Gemini','Libra'],
    Virgo:['Taurus','Capricorn','Cancer','Scorpio'],
    Libra:['Gemini','Aquarius','Leo','Sagittarius'],
    Scorpio:['Cancer','Pisces','Virgo','Capricorn'],
    Sagittarius:['Aries','Leo','Libra','Aquarius'],
    Capricorn:['Taurus','Virgo','Scorpio','Pisces'],
    Aquarius:['Gemini','Libra','Aries','Sagittarius'],
    Pisces:['Cancer','Scorpio','Taurus','Capricorn'],
  };
  return map[sign] || ['Leo','Sagittarius','Gemini','Aquarius'];
}

function getComplementaryElement(el: string): string {
  const map: Record<string, string> = { Fire:'Air', Air:'Fire', Earth:'Water', Water:'Earth' };
  return map[el] || 'Earth';
}

function getElementAttraction(el: string): string {
  const map: Record<string, string> = {
    Fire:'someone who fans your flame with ideas and intellectual spark',
    Air:'someone whose passion and warmth grounds your thoughts into action',
    Earth:"someone whose emotional depth waters your steady roots",
    Water:"someone whose stability and patience holds space for your emotions",
  };
  return map[el] || 'a complementary soul who balances your energy';
}

// ── Mayan ────────────────────────────────────────────────────

function calcMayan(birthDate: string): { sign: string; tone: number; kinNumber: number; color: string } {
  const [y, m, d] = birthDate.split('-').map(Number);
  const ref = Date.UTC(1900, 0, 1);
  const bd = Date.UTC(y, m - 1, d);
  let days = Math.floor((bd - ref) / 86400000);
  if (days < 0) days = 260 - (Math.abs(days) % 260);

  const modernNames = [
    'Red Dragon','White Wind','Blue Night','Yellow Seed',
    'Red Serpent','White Worldbridger','Blue Hand','Yellow Star',
    'Red Moon','White Dog','Blue Monkey','Yellow Human',
    'Red Skywalker','White Wizard','Blue Eagle','Yellow Warrior',
    'Red Earth','White Mirror','Blue Storm','Yellow Sun',
  ];
  const colors = ['Red','White','Blue','Yellow'];
  const signIdx = days % 20;
  const tone = (days % 13) + 1;
  let kin = ((tone - 1) * 20 + signIdx + 1) % 260;
  if (kin === 0) kin = 260;
  return { sign: modernNames[signIdx], tone, kinNumber: kin, color: colors[signIdx % 4] };
}

function getMayanInsight(sign: string): string {
  const lower = sign.toLowerCase();
  const insights: Record<string, string> = {
    dragon:"Your soulmate carries Serpent or Wizard energy — primal passion mixed with enchantment.",
    wind:"Your soulmate carries Storm or Earth energy — grounding depth with transformative spirit.",
    night:"Your soulmate carries Warrior or Mirror energy — courageous truth-seekers who share your dreams.",
    seed:"Your soulmate carries Eagle or Star energy — visionary elegance meets your patience.",
    serpent:"Your soulmate carries Dragon or Jaguar energy — a primal, transformative connection.",
    worldbridger:"Your soulmate carries Serpent or Dog energy — healing and loyalty bridge worlds.",
    hand:"Your soulmate carries Monkey or Night energy — creation and mystery flow together.",
    star:"Your soulmate carries Seed or Monkey energy — elegance and creativity blossom.",
    moon:"Your soulmate carries Dog or Dragon energy — nurturing care meets primal devotion.",
    dog:"Your soulmate carries Moon or Worldbridger energy — deep loyalty and gentle healing.",
    monkey:"Your soulmate carries Hand or Human energy — playful wisdom creates magic.",
    human:"Your soulmate carries Monkey or Seed energy — creative freedom plants new life.",
    skywalker:"Your soulmate carries Human or Wind energy — freedom and communication soar.",
    wizard:"Your soulmate carries Dragon or Mirror energy — enchantment and reflection create magic.",
    eagle:"Your soulmate carries Warrior or Star energy — ambition and beauty align.",
    warrior:"Your soulmate carries Eagle or Night energy — vision and depth create purpose.",
    earth:"Your soulmate carries Wind or Sun energy — grounded wisdom meets radiant truth.",
    mirror:"Your soulmate carries Night or Dog energy — loyalty and deep introspection bond you.",
    storm:"Your soulmate carries Mirror or Wind energy — transformation and clarity run deep.",
    sun:"Your soulmate carries Dragon or Earth energy — a foundational, life-giving bond.",
  };
  for (const [key, text] of Object.entries(insights)) {
    if (lower.includes(key)) return text;
  }
  return `Your Mayan signature (${sign}) attracts a complementary galactic energy — trust the cosmic timing.`;
}

// ── Numerology insights ──────────────────────────────────────

function getLifePathInsight(lp: number): string {
  const map: Record<number, string> = {
    1:"Your soulmate is independent and inspiring — someone who respects your leadership while holding their own ground. Look for Life Paths 3, 5, or 7.",
    2:"Your soulmate is gentle yet deeply perceptive — a natural peacemaker who understands your emotional depth. Look for Life Paths 6, 8, or 9.",
    3:"Your soulmate sparkles with creativity and joy — someone who celebrates self-expression as much as you do. Look for Life Paths 1, 5, or 7.",
    4:"Your soulmate values stability and commitment — a builder who finds beauty in patience and loyalty. Look for Life Paths 2, 6, or 8.",
    5:"Your soulmate thrives on freedom and adventure — someone who keeps life electric and never boring. Look for Life Paths 1, 3, or 7.",
    6:"Your soulmate radiates warmth and responsibility — a nurturer who creates home wherever they are. Look for Life Paths 2, 4, or 9.",
    7:"Your soulmate is a seeker of truth — introspective, spiritual, and drawn to life's deeper mysteries. Look for Life Paths 1, 3, or 5.",
    8:"Your soulmate embodies power and purpose — someone who builds empires and loves fiercely. Look for Life Paths 2, 4, or 6.",
    9:"Your soulmate is a compassionate visionary — someone who serves humanity while loving deeply. Look for Life Paths 2, 6, or 3.",
    11:"Your soulmate carries illuminated energy — a highly intuitive soul who mirrors your spiritual depth. Look for Life Paths 2, 6, or another 11.",
    22:"Your soulmate is a master builder — someone who dreams as big as you and has the discipline to manifest it. Look for Life Paths 4, 6, or 11.",
    33:"Your soulmate is a master healer — unconditionally loving, deeply empathic, and devoted to growth. Look for Life Paths 6, 9, or 11.",
  };
  return map[lp] || map[1];
}

function getCompatibleLifePaths(lp: number): number[] {
  const map: Record<number, number[]> = {
    1:[3,5,7],2:[6,8,9],3:[1,5,7],4:[2,6,8],
    5:[1,3,7],6:[2,4,9],7:[1,3,5],8:[2,4,6],
    9:[2,6,3],11:[2,6,11],22:[4,6,11],33:[6,9,11],
  };
  return map[lp] || [3,5,7];
}

// ── Past Life archetype ──────────────────────────────────────

function getPastLifeArchetype(lp: number, sign: string): { archetype: string; gift: string; lesson: string } {
  const el = getElement(sign);
  const archetypes: Record<string, { archetype: string; gift: string; lesson: string }> = {
    'Fire-1':{ archetype:'The Warrior King', gift:'Fearless leadership', lesson:'Learning to surrender' },
    'Fire-3':{ archetype:'The Court Jester', gift:'Bringing light to darkness', lesson:'Depth over performance' },
    'Fire-5':{ archetype:'The Explorer', gift:'Courage to venture into the unknown', lesson:'Commitment in freedom' },
    'Fire-7':{ archetype:'The Fire Mystic', gift:'Visionary sight', lesson:'Grounding your visions' },
    'Fire-8':{ archetype:'The Conqueror', gift:'Unstoppable will', lesson:'Power in service of love' },
    'Fire-9':{ archetype:'The Crusader', gift:'Righteous passion', lesson:'Discernment in devotion' },
    'Earth-2':{ archetype:'The Keeper of the Sacred', gift:'Tending what matters', lesson:'Receiving as well as giving' },
    'Earth-4':{ archetype:'The Master Craftsperson', gift:'Building to last', lesson:'Flexibility alongside structure' },
    'Earth-6':{ archetype:'The Healer', gift:'Restoring harmony', lesson:'Caring for yourself first' },
    'Earth-8':{ archetype:'The Merchant Prince/Princess', gift:'Creating abundance', lesson:'Power in service of love' },
    'Air-1':{ archetype:'The Visionary', gift:'Seeing what others cannot', lesson:'Listening as deeply as speaking' },
    'Air-3':{ archetype:'The Storyteller', gift:'Holding communities through story', lesson:'Honoring silence' },
    'Air-5':{ archetype:'The Messenger', gift:'Carrying wisdom between worlds', lesson:'Stillness as wisdom' },
    'Air-7':{ archetype:'The Philosopher', gift:'Illuminating truth', lesson:'Living the wisdom you teach' },
    'Air-11':{ archetype:'The Oracle', gift:'Channeling higher realms', lesson:'Grounding your gifts in the body' },
    'Water-2':{ archetype:'The Empath', gift:'Feeling the unseen', lesson:'Boundaries as self-love' },
    'Water-4':{ archetype:'The Keeper of Souls', gift:'Protecting what is sacred', lesson:'Release what no longer serves' },
    'Water-6':{ archetype:'The Priestess / Priest', gift:'Holding sacred space', lesson:'Surrendering control' },
    'Water-9':{ archetype:'The Wandering Saint', gift:'Universal compassion', lesson:'Rooting love in one place' },
    'Water-22':{ archetype:'The World Architect', gift:'Dreaming new systems into being', lesson:'Trusting others to help build' },
  };
  return archetypes[`${el}-${lp}`] || { archetype:'The Seeker', gift:'Innate spiritual curiosity', lesson:'Trusting the journey' };
}

// ── Main handler ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate } = await req.json();

    if (!name || !birthDate) {
      return NextResponse.json({ success: false, message: 'Name and birth date are required.' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
      return NextResponse.json({ success: false, message: 'Invalid birth date format.' }, { status: 400 });
    }

    const lp = calcLifePath(birthDate);
    const expr = calcExpression(name);
    const soulUrge = calcSoulUrge(name);
    const sunSign = getSunSign(birthDate);
    const element = getElement(sunSign);
    const modality = getModality(sunSign);
    const mayan = calcMayan(birthDate);
    const pastLife = getPastLifeArchetype(lp, sunSign);

    const sections = [
      {
        key: 'numerology',
        emoji: '🔢',
        title: 'Soul Number Blueprint',
        summary: getLifePathInsight(lp),
        details: {
          lifePath: lp,
          expression: expr,
          soulUrge,
          soulmateNumbers: getCompatibleLifePaths(lp).join(', '),
        },
      },
      {
        key: 'astrology',
        emoji: '♈',
        title: 'Cosmic Love Profile',
        summary: `As a ${sunSign} (${element} / ${modality}), your soulmate likely carries ${getComplementaryElement(element)} energy — ${getElementAttraction(element)}. Compatible signs: ${getCompatibleSigns(sunSign).slice(0, 2).join(' & ')}.`,
        details: {
          sunSign,
          element,
          modality,
          compatibleSigns: getCompatibleSigns(sunSign).join(', '),
        },
      },
      {
        key: 'mayan',
        emoji: '☀️',
        title: 'Galactic Signature',
        summary: getMayanInsight(mayan.sign),
        details: {
          sign: mayan.sign,
          tone: mayan.tone,
          kinNumber: mayan.kinNumber,
          color: mayan.color,
        },
      },
      {
        key: 'pastLife',
        emoji: '🕊️',
        title: 'Past Life Archetype',
        summary: `In a past life you carried the energy of ${pastLife.archetype}. Your soul gift is ${pastLife.gift.toLowerCase()}. The lesson you bring forward: ${pastLife.lesson.toLowerCase()}.`,
        details: {
          archetype: pastLife.archetype,
          gift: pastLife.gift,
          lesson: pastLife.lesson,
        },
      },
      {
        key: 'elemental',
        emoji: '🌊',
        title: 'Elemental Blueprint',
        summary: `Your chart is ${element}-dominant. Your soulmate likely carries ${getComplementaryElement(element)} energy to create balance — ${getElementAttraction(element)}.`,
        details: {
          dominantElement: element,
          soulmateElement: getComplementaryElement(element),
          modality,
        },
      },
    ];

    const lockedSections = [
      { title: 'Love Language Match', description: 'How your soulmate expresses and receives love' },
      { title: 'Attachment Dynamic', description: 'Your emotional bonding pattern with your match' },
      { title: 'Core Values Alignment', description: '10 life values ranked — how aligned is your match?' },
      { title: 'Lifestyle Fit', description: 'Daily habits, routines, and living preferences' },
      { title: 'Personality Harmony', description: 'Big Five trait pairing — where you complement and where you clash' },
      { title: 'Consciousness Resonance', description: 'Spiritual depth and growth stage compatibility' },
    ];

    return NextResponse.json({
      success: true,
      blueprint: { name, title: `${name}'s Soulmate Blueprint`, sections },
      confidence: 55,
      systemsUsed: ['numerology', 'astrology', 'mayan', 'pastLife', 'elemental'],
      lockedSections,
    });
  } catch (e) {
    console.error('Blueprint error:', e);
    return NextResponse.json({ success: false, message: 'Calculation failed. Please try again.' }, { status: 500 });
  }
}
