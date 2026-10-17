# SoulMates Quest website (www.soulmates.quest)

The free readings portal: horoscope, tarot, numbers and the Moon calendar in English and Bulgarian, plus the friends' "Are you my soulmate?" quiz pages. Next.js 16 (App Router).

Read `AGENTS.md` first (strict rules: main only, production only, one database).

## How it fits together

- **Calculations live on the backend.** The browser calls the production API's public readings (`/api/public/readings/*`, backend `src/routes/publicReadings.js`). The website never recalculates readings.
- **Texts, tarot deck and design assets come from the app**, synced by a script, never edited by hand:
  - `npm run sync:app` reads `../SoulMates-Quest-mobile` (or `APP_REPO=<path>`) at a committed revision and writes `src/content/app/*` and `public/app-content/*`, plus `src/content/app/manifest.json` (app commit and SHA-256 of every file). The 78 tarot images are checked against the deck's `SOURCE.json`.
  - `npm run check:app` verifies the committed copies against the app without writing.
  - `npm test` fails if any synced file no longer matches the manifest.
- **Languages:** `src/i18n/config.ts` (`LOCALES`). Portal pages live under `/{lang}/…`; `/` and unprefixed tool paths redirect by `Accept-Language` (`src/proxy.ts`). Website text is in `src/i18n/site/{en,bg}.ts`; reading text is the app's.
- **Design:** CSS variables generated from the app's tokens (`src/lib/design/tokens.ts`), Inter with Cyrillic, system/light/dark themes, the app's card patterns.
- **The visitor's browser keeps** only what `src/lib/readings/local.ts` lists (no cookies).

## Develop

```bash
npm install
npm run dev            # http://localhost:3000, against the production API
npm test && npm run lint && npx tsc --noEmit
```

To test against a local backend, set `NEXT_PUBLIC_API_URL=http://localhost:5050/api` in `.env.local`. It is inlined at build time, so never build for production with it set.

## Deploy

Git pushes don't deploy (`vercel.json`). Production is deployed deliberately from `main` after checks and the owner's approval.

## Documents

- `docs/WEB_TO_APP_HANDOFF.md`: proposed website → app claim design (not built).
- `LEGAL_DRAFT_TODO.md`: open items before the draft legal pages can take effect.
