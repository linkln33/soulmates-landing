/**
 * UI text for the quiz pages (/quiz/[code], /quiz/answer/delete), English and
 * Bulgarian. Both languages must define every key: `bg` is typed against `en`.
 * Question wording comes from the API and is not translated here.
 */

export type Lang = 'en' | 'bg';
export const LANGS: readonly Lang[] = ['en', 'bg'];

/** Retention months shown when the API does not send `consent.retentionDays`. */
export const FALLBACK_RETENTION_MONTHS = 12;

/** Months for the consent text, from the API's retention in days. */
export function retentionMonths(days: unknown): number {
  if (typeof days !== 'number' || !Number.isFinite(days) || days <= 0) return FALLBACK_RETENTION_MONTHS;
  return Math.max(1, Math.round(days / 30.4));
}

const en = {
  langSwitchLabel: 'Language',
  langShort: { en: 'EN', bg: 'БГ' } as Record<Lang, string>,
  langFull: { en: 'English', bg: 'Български' } as Record<Lang, string>,
  homeLink: 'Soulmates Quest home page',

  metaTitle: 'Are you my soulmate?',
  metaDescription: 'Answer a few questions for the friend who sent you this link.',
  metaDelete: 'Delete your answers — Soulmates Quest',

  cardEyebrow: (name: string) => `From ${name}`,
  introTitle: (name: string) => `${name} asks: Are you my soulmate?`,
  introLead: (name: string) => `Answer a few questions for ${name}.`,
  questionCount: (n: number) => `${n} questions`,
  duration: 'About 3 minutes',
  dataNote: (name: string) => `Your answers go only to ${name}.`,
  dataMore: 'How your answers are used',
  start: 'Start',
  loading: 'Loading the quiz…',

  back: 'Back',
  next: 'Next',
  skip: 'Skip',
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,

  nameTitle: 'Your first name',
  nameHint: (name: string) => `${name} will see it next to your answers.`,
  nameLabel: 'First name',
  nameTooShort: 'Please enter at least 2 characters.',
  nameTooLong: 'Please use 60 characters or fewer.',

  birthTitle: 'Your birth date',
  optional: 'Optional',
  birthReason: (name: string) =>
    `Used only for the traditional signs-and-numbers part of the reading. ${name} sees your sign and life path number, not the date.`,
  birthLegend: 'Birth date',
  day: 'Day',
  month: 'Month',
  year: 'Year',
  birthIncomplete: 'Please fill in the day, month and year, or skip this step.',
  birthInvalid: 'This date does not exist. Please check the day and month.',
  birthRange: 'Please enter a date between 1900 and today.',

  questionOf: (i: number, n: number) => `Question ${i} of ${n}`,
  chooseOne: 'Choose one answer.',
  chooseMany: (min: number) => (min <= 1 ? 'Choose one or more.' : `Choose at least ${min}.`),
  answerRequired: 'Please choose an answer.',
  answerAtLeast: (min: number) => (min <= 1 ? 'Please choose at least one answer.' : `Please choose at least ${min} answers.`),
  translationNote: '',

  customEyebrow: (name: string) => `${name}'s own question`,
  customLabel: 'Your answer',
  customRequired: 'Please write an answer.',
  charCount: (n: number, max: number) => `${n} / ${max}`,

  consentTitle: 'Before you send',
  consentText: (name: string, months: number) =>
    `Your first name and answers go only to ${name}, who made this quiz. SoulMates Quest compares them with ${name}'s own answers to write a reading that only ${name} sees. If you add your birth date, it is used only for the traditional signs-and-numbers part of that reading: ${name} sees your sign and life path number, not the date. Your answers are not shown to anyone else and are not used to match you with anyone. We keep them until ${name} deletes them, or for up to ${months} months, whichever comes first. After sending, you get a link to delete your answers at any time.`,
  agree: 'I agree',
  agreeRequired: 'Please tick “I agree” to send your answers.',
  send: 'Send',
  sending: 'Sending…',
  honeypotLabel: 'Leave this field empty',

  sentTitle: (name: string) => `Sent to ${name}`,
  sentLead: 'Thank you for answering.',
  deletionBox: 'Delete your answers any time with this link. Keep it — it is the only way to delete them without contacting us.',
  deletionLabel: 'Link to delete your answers',
  copy: 'Copy',
  copied: 'Copied',
  copyManual: 'Select the link and copy it.',
  openLink: 'Open the link',
  getApp: 'Get the app',
  makeOwn: 'Make your own — in the app',

  errCheck: 'Please check your answers.',
  errFull: 'This quiz isn’t taking more answers.',
  errPaused: 'This quiz isn’t taking answers right now.',
  errAnswersPaused: 'We aren’t taking new answers yet. Nothing was sent.',
  errNotFound: 'We couldn’t find this quiz any more.',
  errRate: 'You’ve already answered this quiz or sent too many times. Please try again later.',
  errGeneric: 'Something went wrong on our side. Please try again.',
  errNetwork: 'We couldn’t reach the server. Check your connection and try again.',
  reference: (id: string) => `Reference: ${id}`,
  retry: 'Try again',

  notFoundTitle: 'We couldn’t find this quiz',
  notFoundText: 'Check the link you were sent, or ask the person who sent it for a new one.',
  pausedTitle: 'This quiz isn’t taking answers right now',
  pausedText: 'Ask the person who sent it to you to check it in the app.',
  answersPausedTitle: 'Answers are paused for now',
  answersPausedText: (name: string) =>
    `${name}’s quiz is here, but we aren’t taking new answers yet while we finish our privacy notice. Please come back to this link later.`,
  loadErrorTitle: 'The quiz didn’t load',
  loadErrorText: 'Please try again in a moment.',
  goHome: 'Go to the home page',

  deleteTitle: 'Delete your answers?',
  deleteText: 'This permanently deletes the answers you sent with this link. It can’t be undone.',
  deleteButton: 'Delete',
  deleting: 'Deleting…',
  deleted: 'Your answers were deleted.',
  deleteNotFound: 'These answers weren’t found. They may already be deleted.',
  deleteNoToken: 'This link is incomplete. Open the full link you got after sending your answers.',
  deleteRate: 'Too many attempts. Please wait a minute and try again.',
};

export type Messages = typeof en;

const bg: Messages = {
  langSwitchLabel: 'Език',
  langShort: { en: 'EN', bg: 'БГ' },
  langFull: { en: 'English', bg: 'Български' },
  homeLink: 'Начална страница на Soulmates Quest',

  metaTitle: 'Ти ли си моята сродна душа?',
  metaDescription: 'Отговори на няколко въпроса за приятеля, който ти е изпратил тази връзка.',
  metaDelete: 'Изтрий отговорите си — Soulmates Quest',

  cardEyebrow: (name) => `От ${name}`,
  introTitle: (name) => `${name} пита: Ти ли си моята сродна душа?`,
  introLead: (name) => `Отговори на няколко въпроса за ${name}.`,
  questionCount: (n) => `${n} въпроса`,
  duration: 'Около 3 минути',
  dataNote: (name) => `Отговорите ти отиват само при ${name}.`,
  dataMore: 'Как се използват отговорите ти',
  start: 'Започни',
  loading: 'Тестът се зарежда…',

  back: 'Назад',
  next: 'Напред',
  skip: 'Пропусни',
  stepOf: (i, n) => `Стъпка ${i} от ${n}`,

  nameTitle: 'Малкото ти име',
  nameHint: (name) => `${name} ще го вижда до отговорите ти.`,
  nameLabel: 'Малко име',
  nameTooShort: 'Въведи поне 2 знака.',
  nameTooLong: 'Използвай най-много 60 знака.',

  birthTitle: 'Датата ти на раждане',
  optional: 'По желание',
  birthReason: (name) =>
    `Използва се само за традиционната част „Знаци и числа“ на прочита. ${name} вижда зодията и числото на жизнения ти път, но не и датата.`,
  birthLegend: 'Дата на раждане',
  day: 'Ден',
  month: 'Месец',
  year: 'Година',
  birthIncomplete: 'Попълни ден, месец и година или пропусни тази стъпка.',
  birthInvalid: 'Тази дата не съществува. Провери деня и месеца.',
  birthRange: 'Въведи дата между 1900 г. и днес.',

  questionOf: (i, n) => `Въпрос ${i} от ${n}`,
  chooseOne: 'Избери един отговор.',
  chooseMany: (min) => (min <= 1 ? 'Избери един или повече.' : `Избери поне ${min}.`),
  answerRequired: 'Избери отговор.',
  answerAtLeast: (min) => (min <= 1 ? 'Избери поне един отговор.' : `Избери поне ${min} отговора.`),
  translationNote: 'Въпросите са на английски, докато бъде готов проверен превод.',

  customEyebrow: (name) => `Въпрос от ${name}`,
  customLabel: 'Твоят отговор',
  customRequired: 'Напиши отговор.',
  charCount: (n, max) => `${n} / ${max}`,

  consentTitle: 'Преди да изпратиш',
  consentText: (name, months) =>
    `Името и отговорите ти отиват само при ${name}, който е създал този тест. SoulMates Quest ги сравнява със собствените отговори на ${name} и съставя прочит, който вижда само ${name}. Ако добавиш датата си на раждане, тя се използва само за традиционната част „Знаци и числа“: ${name} вижда зодията и числото на жизнения ти път, но не и датата. Отговорите ти не се показват на никого другиго и не се използват, за да те свързваме с други хора. Пазим ги, докато ${name} не ги изтрие, или до ${months} месеца — което настъпи първо. След изпращане ще получиш връзка, с която можеш да изтриеш отговорите си по всяко време.`,
  agree: 'Съгласен(на) съм',
  agreeRequired: 'Отбележи „Съгласен(на) съм“, за да изпратиш отговорите си.',
  send: 'Изпрати',
  sending: 'Изпращане…',
  honeypotLabel: 'Остави това поле празно',

  sentTitle: (name) => `Изпратено до ${name}`,
  sentLead: 'Благодарим ти, че отговори.',
  deletionBox:
    'Можеш да изтриеш отговорите си по всяко време с тази връзка. Запази я — само с нея можеш да ги изтриеш, без да се свързваш с нас.',
  deletionLabel: 'Връзка за изтриване на отговорите',
  copy: 'Копирай',
  copied: 'Копирано',
  copyManual: 'Маркирай връзката и я копирай.',
  openLink: 'Отвори връзката',
  getApp: 'Изтегли приложението',
  makeOwn: 'Създай свой тест — в приложението',

  errCheck: 'Провери отговорите си.',
  errFull: 'Този тест вече не приема отговори.',
  errPaused: 'Този тест не приема отговори в момента.',
  errAnswersPaused: 'Все още не приемаме нови отговори. Нищо не е изпратено.',
  errNotFound: 'Този тест вече не може да бъде намерен.',
  errRate: 'Вече си отговорил(а) на този тест или си изпращал(а) твърде много пъти. Опитай отново по-късно.',
  errGeneric: 'Нещо се обърка при нас. Опитай отново.',
  errNetwork: 'Няма връзка със сървъра. Провери интернет връзката си и опитай отново.',
  reference: (id) => `Номер за справка: ${id}`,
  retry: 'Опитай отново',

  notFoundTitle: 'Не намерихме този тест',
  notFoundText: 'Провери връзката, която си получил(а), или поискай нова от човека, който ти я е изпратил.',
  pausedTitle: 'Този тест не приема отговори в момента',
  pausedText: 'Помоли човека, който ти го е изпратил, да го провери в приложението.',
  answersPausedTitle: 'Отговорите са спрени засега',
  answersPausedText: (name) =>
    `Тестът на ${name} е тук, но още не приемаме нови отговори, докато завършим известието си за поверителност. Отвори този линк отново по-късно.`,
  loadErrorTitle: 'Тестът не се зареди',
  loadErrorText: 'Опитай отново след малко.',
  goHome: 'Към началната страница',

  deleteTitle: 'Да изтрием ли отговорите ти?',
  deleteText: 'Това изтрива завинаги отговорите, които си изпратил(а) с тази връзка. Действието е необратимо.',
  deleteButton: 'Изтрий',
  deleting: 'Изтриване…',
  deleted: 'Отговорите ти бяха изтрити.',
  deleteNotFound: 'Тези отговори не бяха намерени. Може вече да са изтрити.',
  deleteNoToken: 'Тази връзка е непълна. Отвори цялата връзка, която получи след изпращането на отговорите.',
  deleteRate: 'Твърде много опити. Изчакай минута и опитай отново.',
};

export const MESSAGES: Record<Lang, Messages> = { en, bg };

export function messages(lang: Lang): Messages {
  return MESSAGES[lang];
}

export function isLang(value: unknown): value is Lang {
  return value === 'en' || value === 'bg';
}

/**
 * UI language: `?lang=` wins; otherwise Bulgarian when the browser's
 * Accept-Language ranks Bulgarian above English; otherwise English.
 */
export function resolveLang(langParam: unknown, acceptLanguage: string | null | undefined): Lang {
  const param = Array.isArray(langParam) ? langParam[0] : langParam;
  if (isLang(param)) return param;
  if (!acceptLanguage) return 'en';
  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const q = qParam ? Number(qParam.slice(2)) : 1;
      return { primary: tag.split('-')[0], q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((entry) => entry.q > 0 && (entry.primary === 'bg' || entry.primary === 'en'))
    .sort((a, b) => b.q - a.q || a.index - b.index);
  return ranked[0]?.primary === 'bg' ? 'bg' : 'en';
}
