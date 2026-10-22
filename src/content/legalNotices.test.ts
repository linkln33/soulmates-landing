/**
 * Legal notices match what the app and server actually do (review of the
 * 19 October privacy draft). Each check pins one reviewed statement in both
 * languages, so a later edit cannot quietly drop it.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const LEGAL = join(import.meta.dirname, 'legal');
const doc = (name: string) => readFileSync(join(LEGAL, name), 'utf8');
const section = (text: string, n: number) => {
  const start = text.indexOf(`\n## ${n}. `);
  assert.ok(start >= 0, `section ${n}`);
  const end = text.indexOf('\n## ', start + 1);
  return text.slice(start, end < 0 ? undefined : end);
};

const LANGS = {
  en: {
    pending: '[to be confirmed: applies from the next app update]',
    orientationConsent: 'named in the matching agreement',
    separateStep: 'in its own separate step',
    intent: 'the kind of connection each of you is looking for',
    intentAccount: 'the kind of connection you are looking for',
    noPaid: 'There are no paid features',
    noOracle: 'does not offer an in-app AI Oracle',
    concealedScore: 'a fixed overall compatibility score',
    concealedNoAreas: 'Area results and the match type are not shown before both members accept',
    completeOnly: 'Only members with a complete profile are compared',
    termsFree: 'readings, matching and chat',
    googleConfigured: 'We use Google Places where it is configured, otherwise Nominatim',
    phoneGeocoder: "your phone's own location service (from Google or Apple)",
    precision: 'to about 100 m',
    resend: '| Resend |',
    accountId: 'your account identifier',
    reportRefs: 'references to the reports about your account',
    reapplied: 'the new account gets the same restriction and those reports are linked to it again',
    signupRefused: 'an email sign-up with that address is refused',
    relinkedReports: 'the reports can be linked to a new account again',
    openOnly: 'Account with open reports only: as long as those reports are kept',
    cannotDelete: 'the app cannot complete the deletion',
    del: { relinked: 'linked to it again', refused: 'an email sign-up with that address is refused', exception: 'except in the case in the next point' },
  },
  bg: {
    pending: '[предстои потвърждение: важи от следващата актуализация на приложението]',
    orientationConsent: 'посочени в съгласието за свързване',
    separateStep: 'в отделна стъпка',
    intent: 'какъв вид връзка търси всеки',
    intentAccount: 'какъв вид връзка търсите',
    noPaid: 'Няма платени функции',
    noOracle: 'не предлага Оракул с изкуствен интелект в самото приложение',
    concealedScore: 'непроменлив общ резултат за съвместимост',
    concealedNoAreas: 'Резултатите по области и видът връзка не се показват, преди и двамата членове да приемат',
    completeOnly: 'Сравняват се само членове с пълен профил',
    termsFree: 'прочитите, свързването и разговорите',
    googleConfigured: 'Използваме Google Places, когато е настроен, а иначе Nominatim',
    phoneGeocoder: 'услугата за местоположение на телефона ви (на Google или Apple)',
    precision: 'с точност до около 100 м',
    resend: '| Resend |',
    accountId: 'идентификатора на акаунта ви',
    reportRefs: 'препратки към сигналите срещу акаунта ви',
    reapplied: 'новият акаунт получава същото ограничение и сигналите отново се свързват с него',
    signupRefused: 'регистрация с имейл с този адрес се отказва',
    relinkedReports: 'сигналите може отново да бъдат свързани с нов акаунт',
    openOnly: 'Акаунт само с отворени сигнали: докато тези сигнали се пазят',
    cannotDelete: 'приложението не може да завърши изтриването',
    del: { relinked: 'отново се свързват с него', refused: 'регистрация с имейл с този адрес се отказва', exception: 'освен в случая от следващата точка' },
  },
} as const;

for (const [lang, t] of Object.entries(LANGS)) {
  const privacy = doc(`privacy.${lang}.md`);
  const deletion = doc(`delete-account.${lang}.md`);

  test(`${lang}: section 7 says which agreement covers orientation, and the separate step is marked as not yet released`, () => {
    const s7 = section(privacy, 7);
    assert.ok(s7.includes(t.orientationConsent), 'orientation consent named');
    assert.ok(s7.includes(t.separateStep));
    assert.ok(s7.includes(t.pending), 'separate step carries the next-update marker');
  });

  test(`${lang}: relationship intent is listed for matching`, () => {
    assert.ok(section(privacy, 6).includes(t.intentAccount));
    assert.ok(section(privacy, 8).includes(t.intent));
  });

  test(`${lang}: no paid features, no in-app Oracle, and no Oracle purchases or AI provider are described`, () => {
    const s9 = section(privacy, 9);
    assert.ok(s9.includes(t.noPaid));
    assert.ok(s9.includes(t.noOracle));
    const terms = doc(`terms.${lang}.md`);
    assert.ok(section(terms, 10).includes(t.termsFree), 'terms: readings, matching and chat are free');
    for (const text of [privacy, deletion, terms]) {
      assert.doesNotMatch(text, /Anthropic|purchase|покуп|only paid feature|единствената платена/);
    }
  });

  test(`${lang}: concealed matches show only a verified overall score, and only complete profiles are compared`, () => {
    const s8 = section(privacy, 8);
    assert.ok(s8.includes(t.concealedScore));
    assert.ok(s8.includes(t.concealedNoAreas));
    assert.ok(s8.includes(t.completeOnly));
    // Approved blurred previews stay disclosed (owner, 22 Oct 2026).
    assert.match(s8, /blurred|размазана/);
    assert.doesNotMatch(doc(`terms.${lang}.md`), /no compatibility score is shown yet|засега не се показва оценка/);
  });

  test(`${lang}: location search, the phone geocoder and the account-email provider are named accurately`, () => {
    const s6 = section(privacy, 6);
    const s11 = section(privacy, 11);
    assert.ok(s6.includes(t.phoneGeocoder));
    assert.ok(s6.includes(t.precision));
    assert.ok(s11.includes(t.googleConfigured));
    assert.ok(s11.includes(t.resend));
    assert.doesNotMatch(s11, /when it is available|когато е достъпен/);
  });

  test(`${lang}: the restricted-deletion record is described in full and marked as not yet released`, () => {
    const s10 = section(privacy, 10);
    const s12 = section(privacy, 12);
    assert.ok(s10.includes(t.relinkedReports), 'section 10 qualifies "link removed"');
    for (const phrase of [t.accountId, t.reportRefs, t.reapplied, t.signupRefused, t.openOnly, t.cannotDelete, t.pending]) {
      assert.ok(s12.includes(phrase), phrase);
    }
    const s5 = section(deletion, 5);
    for (const phrase of [t.del.relinked, t.del.refused, t.del.exception, t.pending]) assert.ok(s5.includes(phrase), phrase);
  });
}

test('bg: reviewed Bulgarian wording', () => {
  const bg = doc('privacy.bg.md');
  assert.ok(bg.includes('защото могат да разкрият религиозни или философски убеждения'));
  assert.ok(!bg.includes('защото може да разкрият религиозни'));
  assert.ok(bg.includes('да изберете възможните съвпадения да се приемат от ваша страна автоматично, без да ги преглеждате'));
});

test('privacy notices keep the same numbered sections in both languages', () => {
  const heads = (text: string) => [...text.matchAll(/^## (\d+)\. /gm)].map((m) => m[1]);
  assert.deepEqual(heads(doc('privacy.en.md')), heads(doc('privacy.bg.md')));
  assert.deepEqual(heads(doc('delete-account.en.md')), heads(doc('delete-account.bg.md')));
});
