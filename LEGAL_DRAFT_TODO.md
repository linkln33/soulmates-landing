# Legal drafts: open items

`/privacy` and `/terms` are **drafts**. Each one shows a "Draft — not yet in effect" banner, is set to `noindex`, and is left out of the sitemap. Before either page can take effect, every placeholder below needs a reviewed answer, and the banner and the `robots: { index: false }` metadata have to be removed. Planning reference: decision D-L1 in `SoulMates-Quest-mobile/docs/IMPLEMENTATION_PLAN.md`.

## Privacy (`src/app/privacy/page.tsx`)

- [ ] `[MISSING: legal entity name]`
- [ ] `[MISSING: registered address]`
- [ ] `[MISSING: company registration number]`
- [ ] `[MISSING: contact email for privacy requests]`
- [ ] `[MISSING: lawful basis — to be confirmed by counsel]` (free-reading processing)
- [ ] `[MISSING: lawful basis for the quiz — to be confirmed by counsel]` (soulmate quiz answers from friends)
- [ ] Quiz retention: 12 months is a proposed period, pending review. The consent text on `/quiz` takes the months from the API (`LEXICON_RETENTION_DAYS`); the privacy page states 12 and must be updated if that changes
- [ ] `[MISSING: hosting log retention period]` (Vercel request logs)
- [ ] `[MISSING: email provider and retention period]` (mail sent to hello@soulmates.quest)
- [ ] `[MISSING: applicable law, data subject rights wording and how to exercise them — to be confirmed by counsel]`
- [ ] `[MISSING: supervisory authority confirmation]`
- [ ] `[MISSING: effective date]`

## Terms (`src/app/terms/page.tsx`)

- [ ] `[MISSING: legal entity name]`
- [ ] `[MISSING: registered address]`
- [ ] `[MISSING: company registration number]`
- [ ] `[MISSING: minimum age for the future app]`. The product guardrail in PRODUCT_REINVENTION §8 says under-18s can't use matching; this needs confirming.
- [ ] `[MISSING: minimum age, if any, for using the website]`
- [ ] `[MISSING: acceptable use, intellectual property and limitation of liability wording — to be drafted by counsel]`
- [ ] `[MISSING: governing law and jurisdiction]`
- [ ] `[MISSING: contact email for legal notices]`
- [ ] `[MISSING: effective date]`

## Facts the privacy draft relies on (re-check if the code changes)

- The website has no server code of its own. The readings are calculated by the SoulMates Quest API (`/api/public/readings/*`, backend `src/routes/publicReadings.js`), called from the visitor's browser.
- Horoscope and Moon requests send only a sign and a time zone. Numbers sends the birth date and time zone in the request body (never the URL). The API doesn't store or log them.
- Tarot card of the day sends a random browser identifier (kept in local storage) and the time zone. The API doesn't store the identifier. Draws send only the number of cards; the question stays in the browser.
- The API's rate limits store a keyed hash of the IP address for 48 hours (`RateLimitEvent`).
- Local storage keys: `sq.visitor`, `sq.tarot.daily`, `sq.tarot.draw.1`, `sq.tarot.draw.3`, `sq.theme` (`src/lib/readings/local.ts`). No cookies, analytics, advertising or tracking scripts. Fonts are self-hosted by `next/font`.
- The site and the API are hosted on Vercel.
