/**
 * Website text (English). Reading content — signs, horoscope, tarot, numbers
 * and Moon texts — comes from the app (src/content/app, synced). Every key
 * here must exist in every other language file (enforced by SiteMessages).
 */
const en = {
  siteName: 'SoulMates Quest',
  skipToContent: 'Skip to content',
  nav: {
    label: 'Main',
    home: 'Home',
    horoscope: 'Horoscope',
    tarot: 'Tarot',
    numbers: 'Numbers',
    moon: 'Moon',
    app: 'The app',
    menu: 'Menu',
  },
  theme: {
    label: 'Appearance',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
  },
  language: 'Language',
  footer: {
    tagline: 'Free readings for reflection. Real people when the time is right.',
    tools: 'Free tools',
    about: 'About',
    privacy: 'Privacy (draft)',
    terms: 'Terms (draft)',
    contact: 'Contact',
    note: 'Readings follow traditional astrology, tarot and numerology. They are for reflection, not prediction.',
  },
  states: {
    loading: 'Loading…',
    retry: 'Try again',
    errorTitle: 'Something went wrong',
    errorBody: 'We couldn’t load this. Check your connection and try again.',
    rateLimited: 'Too many requests in a short time. Please wait a minute and try again.',
    invalid: 'Please check what you entered.',
  },
  reflection: 'A reflection, not a prediction.',
  home: {
    metaTitle: 'Free horoscope, tarot, numbers and Moon calendar — SoulMates Quest',
    metaDescription:
      'Free readings with no account: your horoscope for today, tomorrow, the week and the month, tarot with all 78 cards, your numbers from your birth date, and the Moon calendar.',
    eyebrow: 'Free readings, no account needed',
    title: 'Readings for reflection, made with care',
    lead:
      'Your horoscope, a tarot card, your numbers and the Moon — complete and free. Every reading follows a stated tradition and real sky positions, and none of it needs an account.',
    start: 'Choose a reading',
    toolsTitle: 'Free tools',
    toolsLead: 'Pick a reading. Each one gives you the whole result here, on this page.',
    open: 'Open',
    soonTitle: 'Being prepared',
    soonLead: 'These readings exist in our plans, not yet on the site. We’ll add each one when it works properly.',
    soon: ['Coffee cup readings', 'Dream meanings', 'Readings for two', 'Runes and I Ching', 'Guides to the traditions'],
    honestTitle: 'How we approach readings',
    honest: [
      { title: 'Real sky, stated rules', body: 'Moon and planet positions are calculated astronomically. Numbers follow one documented rule.' },
      { title: 'Our own texts and deck', body: 'Horoscope texts and tarot meanings are written by us. The tarot deck is our own artwork.' },
      { title: 'Nothing to sign up for', body: 'Every reading here is complete without an account. We don’t store what you enter.' },
    ],
    moonTitle: 'The Moon right now',
    moonMore: 'Moon calendar',
  },
  tools: {
    horoscope: { title: 'Horoscope', about: 'Any sign: today, tomorrow, this week and this month.' },
    tarot: { title: 'Tarot', about: 'Your card for today, one card or three, and all 78 cards.' },
    numbers: { title: 'Numbers', about: 'Your life path and your personal year, month and day.' },
    moon: { title: 'Moon calendar', about: 'Phase, sign and the Moon’s next changes.' },
  },
  invite: {
    title: 'Keep your readings in the app',
    horoscope: 'In the SoulMates Quest app your horoscope follows your own sign from your birth date, alongside the Moon and your numbers.',
    tarot: 'In the SoulMates Quest app your card of the day is kept with your account, on every device you sign in on.',
    numbers: 'In the SoulMates Quest app your numbers update every day from the birth date in your profile.',
    moon: 'In the SoulMates Quest app the Moon calendar shows when the Moon is in your own sign.',
    cta: 'About the app',
  },
  horoscope: {
    metaTitle: 'Free horoscope for every sign — today, tomorrow, week, month',
    metaDescription:
      'Choose your zodiac sign for a free written horoscope for today, tomorrow, this week and this month, based on where the Moon, Sun and planets really are.',
    title: 'Horoscope',
    lead: 'Choose a sign to read its horoscope for today, tomorrow, this week or this month.',
    chooseSign: 'Choose a sign',
    aboutTitle: 'How these horoscopes are made',
    about: [
      'We calculate where the Moon, the Sun, Mercury, Venus and Mars really are, then count from each sign the way traditional astrology does (whole-sign “solar houses”).',
      'Each placement has its own written text. Everyone with the same sign gets the same reading on the same day, because it describes the sky, not you personally.',
      'Times are shown in your time zone.',
    ],
    signMetaTitle: '{sign} horoscope — today, tomorrow, week and month',
    signMetaDescription:
      'Free {sign} horoscope for today, tomorrow, this week and this month, written for where the Moon, Sun and planets really are. Dates, element and ruler of {sign}.',
    periodsLabel: 'Period',
    readingTitle: '{period} · {range}',
    otherSigns: 'Other signs',
    timezoneNote: 'Times shown for {zone}.',
  },
  tarot: {
    metaTitle: 'Free tarot: card of the day, one card and three cards',
    metaDescription:
      'Free tarot readings with all 78 cards of our own deck: your card of the day, a one-card draw and a three-card reading, with upright and reversed meanings.',
    title: 'Tarot',
    lead: 'Draw from our own 78-card deck. Each card shows its traditional meaning, upright or reversed.',
    dailyTitle: 'Your card today',
    dailyLead: 'One card from the full deck, drawn for you today. It stays the same until midnight in your time zone.',
    dailyBrowser:
      'Your card is linked to this browser by a random identifier stored only here. It won’t follow you to another browser or device, and clearing site data starts afresh.',
    reveal: 'Reveal my card',
    oneTitle: 'One-card reading',
    oneLead: 'Think of a question or a situation, then draw one card.',
    oneMetaTitle: 'Free one-card tarot reading',
    oneMetaDescription: 'Ask a question and draw one card from our 78-card tarot deck, with its upright or reversed meaning.',
    threeTitle: 'Three-card reading',
    threeLead: 'Think of a question or a situation, then draw three cards: where you are, what is in the way, and what can help.',
    threeMetaTitle: 'Free three-card tarot reading',
    threeMetaDescription:
      'A free three-card tarot reading: where you are, what is in the way and what can help, from our own 78-card deck.',
    questionLabel: 'Your question (optional)',
    questionHint: 'Your question stays in this browser. It is never sent to us.',
    drawOne: 'Draw a card',
    drawThree: 'Draw three cards',
    drawAgain: 'New reading',
    drawnAt: 'Drawn {when}',
    keptNote: 'This reading stays here until you start a new one.',
    libraryTitle: 'The 78 cards',
    libraryMetaTitle: 'All 78 tarot cards and their meanings',
    libraryMetaDescription:
      'Every card of the tarot — Major Arcana, Wands, Cups, Swords and Pentacles — with its upright and reversed meaning, in love and at work.',
    cardMetaTitle: '{card} tarot card meaning — upright and reversed',
    cardMetaDescription: '{card}: {keywords}. Upright and reversed meaning, in love and at work, with the card from our own deck.',
    readings: 'Readings',
    library: 'All 78 cards',
    openLibrary: 'See all 78 cards',
    aboutTitle: 'About this deck',
    about: [
      'The artwork is our own SoulMates Quest deck. The meanings are our own wording of the traditional ones described by A. E. Waite in 1911.',
      'About three in ten cards come up reversed, which changes their meaning.',
      'Tarot is a prompt for reflection. A card can’t tell you what will happen.',
    ],
    prevCard: 'Previous card',
    nextCard: 'Next card',
    meaningUpright: 'Upright',
    meaningReversed: 'Reversed',
  },
  numbers: {
    metaTitle: 'Free numerology: life path and personal year, month and day',
    metaDescription:
      'Enter your birth date for your life path number and your personal year, month and day, with how each is calculated.',
    title: 'Numbers',
    lead: 'Enter your birth date to see your life path and the numbers of your year, month and today.',
    birthLabel: 'Birth date',
    calculate: 'Show my numbers',
    privacy: 'Your birth date is sent to our server only to calculate this. It isn’t stored.',
    missing: 'Please enter your birth date.',
    invalid: 'Please enter a real date between 1900 and today.',
    nameNote: 'Name-based numbers (expression and soul urge) are not offered yet.',
    aboutTitle: 'How numerology works here',
    about: [
      'Life path: your birth month, day and year are each reduced to one digit, then added. 11, 22 and 33 are kept as master numbers.',
      'Your year, month and day combine your birth date with today’s date and are always reduced to 1–9.',
      'Numerology is a tradition for reflection, not a prediction.',
    ],
    again: 'Use another date',
  },
  moon: {
    metaTitle: 'Moon calendar: phase today, Moon sign and the next 30 days',
    metaDescription:
      'The Moon right now: its phase, how much of it is lit, which sign it is in and when it moves on, plus every sign change, New and Full Moon in the next 30 days.',
    title: 'Moon calendar',
    lead: 'Where the Moon is now and what changes over the next 30 days, in your time zone.',
    nowTitle: 'Right now',
    entered: 'Entered {sign} on {when}',
    leaves: 'Moves {into} on {when}',
    nextPhase: 'Next: {phase} on {when}',
    calendarTitle: 'The next 30 days',
    listTitle: 'All changes',
    legendPhase: 'Main phase',
    legendSign: 'Moon changes sign',
    aboutTitle: 'About these times',
    about: [
      'The Moon’s position, phase and sign changes are calculated astronomically and shown in your time zone.',
      'The Moon moves into a new sign every two to three days and goes through all its phases in about 29.5 days.',
      'What each sign is said to bring follows traditional astrology, for reflection.',
    ],
  },
  app: {
    metaTitle: 'The SoulMates Quest app',
    metaDescription:
      'The SoulMates Quest app is preparing a private pilot. It isn’t in the App Store or Google Play yet. Here is how joining and admission will work.',
    title: 'The SoulMates Quest app',
    lead:
      'The app is where your readings meet real people: one introduction at a time, between members who have both agreed to be introduced.',
    statusTitle: 'Where things stand',
    status:
      'The app is being prepared for a private pilot. It isn’t in the App Store or Google Play yet, and there is no public download. We aren’t promising a date.',
    howTitle: 'How joining will work',
    steps: [
      { title: 'Use the free readings', body: 'Everything on this website stays free and complete, with or without an account.' },
      { title: 'Create your account in the app', body: 'You sign in with Google or with an email and password. Your readings start with your birth date.' },
      { title: 'A balance check', body: 'To keep the community balanced, the app admits women and men so that each stays between 48% and 52% of the members being introduced.' },
      { title: 'Admitted, or waiting', body: 'If there is room, you’re in. If not, you wait and the app lets you know when you’re admitted. Your readings stay available while you wait.' },
    ],
    profileTitle: 'Your profile grows gradually',
    profile:
      'Your birth date is enough for the basic readings. Further answers in the app allow deeper readings over time. Nothing you do on this website adds you to introductions: that only happens in the app, with your explicit consent.',
    quizTitle: '“Are you my soulmate?”',
    quiz:
      'Members of the app can send friends a short quiz. Friends answer it on this website, without installing the app or creating an account.',
    contact: 'Questions? Write to {email}.',
    backToTools: 'Back to the free readings',
  },
  notFound: {
    title: 'Page not found',
    body: 'This page doesn’t exist, or it has moved.',
    home: 'Go to the free readings',
  },
};

export default en;

type DeepStrings<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly DeepStrings<U>[]
    : { [K in keyof T]: DeepStrings<T[K]> };
export type SiteMessages = DeepStrings<typeof en>;
