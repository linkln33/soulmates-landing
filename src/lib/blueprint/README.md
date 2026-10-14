# Free-reading calculators

Pure functions behind `POST /api/blueprint`. The route (`src/app/api/blueprint/route.ts`) only parses JSON, calls `validateInput` and `buildBlueprint` from `blueprint.ts`, and returns the result. Nothing submitted is stored.

Tests: `npm test` (runs `node --test` on `*.test.ts`, using Node's built-in TypeScript type stripping). Modules here import each other with explicit `.ts` extensions and don't use the `@/` alias, so Node can run them directly.

## Numerology letter convention (`numerology.ts`)

1. Each character is lower-cased and taken in NFC form.
   - If it's one of the 30 Bulgarian letters, it is scored with the Bulgarian table. This check runs first, so `й` is never reduced to `и`.
   - Otherwise it is decomposed to NFD and combining marks are stripped. If a single Latin letter `a`–`z` remains (`é→e`, `ë→e`, `ñ→n`), it is scored with the Latin table.
   - Everything else is **ignored**: digits, spaces, punctuation, CJK, Greek, Russian- and Ukrainian-only letters (`ё ы э і ї є ґ`), Bulgarian `ѝ`, and Latin letters that don't decompose to `a`–`z` (`ß ø æ ł`).
2. **Latin**: standard Pythagorean values. a=1 … i=9, j=1 … r=9, s=1 … z=8.
3. **Bulgarian Cyrillic**: each letter's position in the 30-letter alphabet `а б в г д е ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ь ю я`, reduced on the same 1–9 cycle: `value = ((position − 1) mod 9) + 1`. So а=1 … и=9, й=1 … с=9, т=1 … ъ=9, ь=1, ю=2, я=3.
4. **Mixed-script names**: each letter uses its own script's table.
5. **Vowels** (soul urge): Latin `a e i o u y`. `y` is always counted as a vowel, which keeps the previous behaviour. Bulgarian vowels are `а е и о у ъ ю я`.
6. **No countable letters**: expression and soul urge are `null`, and the UI says they couldn't be calculated for the characters entered. If the name has letters but no counted vowels, only soul urge is `null`. There is no fallback "1".

## Reduction rule

`reduce(n)`: while `n > 9` and `n` is not 11, 22 or 33, replace `n` with the sum of its digits. Master numbers are kept whenever a step lands on them (29 → 11 stays 11; 66 → 12 → 3).

- Expression = `reduce(sum of letter values)`
- Soul urge = `reduce(sum of vowel values)`
- Life path = `reduce(reduce(month) + reduce(day) + reduce(year))`. Month, day and year are each reduced on their own (masters kept), then added and reduced again (masters kept). Example: 1996-02-29 → 2 + 11 + 7 = 20 → **2**.

## Dates (`dates.ts`)

- Only `YYYY-MM-DD` strings that round-trip as real calendar dates are accepted. For example, `1995-02-31`, `2023-02-29`, `1990-13-01` and `1990-00-00` are rejected, while `2024-02-29` is accepted.
- The year must be 1900 or later.
- **Future dates**: the server accepts dates up to *today in Europe/Sofia plus one day*. This extra day exists so that visitors in time zones ahead of Sofia aren't rejected for entering their own local "today". The browser form uses the visitor's local date (not UTC) as its maximum.

## Sun sign (`sunSign.ts`)

The sun sign comes from a fixed cut-off table, for example Pisces 19 Feb – 20 Mar, Aries 21 Mar – 19 Apr, Sagittarius 22 Nov – 21 Dec, and Capricorn 22 Dec – 19 Jan. The element is shown as part of the sun-sign section, not as a separate system. If the month or day is out of range, the result is `null`; there is no Pisces fallback.

## Past-life archetype (`pastLife.ts`)

A fixed lookup by sun-sign element and life path number. It is presented as a symbolic storytelling image, not as a claim about a past life.

## Disabled

**Mayan** is disabled until a convention (Dreamspell or the classic count) and reference fixtures are agreed. The previous implementation's kin number contradicted its own tone and seal; see git history.
