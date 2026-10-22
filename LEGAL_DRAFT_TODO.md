# Legal drafts: open items

> **Status (22 Oct 2026).** Parts of this list predate the owner's decision of 18 Oct 2026 to publish the drafts. Verified against the code: the pages are now `/{lang}/privacy`, `/{lang}/terms`, `/{lang}/safety`, `/{lang}/delete-account` (and `/{lang}/about`), with text in `src/content/legal/{slug}.{en,bg}.md`, rendered by `src/components/site/DocPage.tsx`. They **are published**, with a draft banner, `noindex` and left out of the sitemap while listed in `DRAFT_DOCS` (`src/lib/site/config.ts`); `LegalDraft.tsx` and the `LEGAL_DRAFTS=show` switch no longer exist. Open points in the texts are now marked `[to be confirmed]` or `[period to be confirmed]` rather than `[MISSING: …]`; search the `.md` files for them. The paragraph below is kept as the original record.

`/privacy` and `/terms` are **drafts and are not published**: they return 404 unless the site is built with `LEGAL_DRAFTS=show` (local review only; `legalDraftsShown()` in `src/components/site/LegalDraft.tsx`), and nothing links to them. When shown, each one shows a "Draft — not yet in effect" banner, is set to `noindex`, and is left out of the sitemap. Before either page can take effect, every placeholder below needs a reviewed answer, and the banner and the `robots: { index: false }` metadata have to be removed. Planning reference: decision D-L1 in `SoulMates-Quest-mobile/docs/IMPLEMENTATION_PLAN.md`.

## Privacy (now `src/content/legal/privacy.{en,bg}.md`)

- [x] `[MISSING: legal entity name]` (REAL4LIFE LTD, in the texts since 18 Oct 2026)
- [x] `[MISSING: registered address]`
- [x] `[MISSING: company registration number]` (UK company 15724723)
- [ ] `[MISSING: contact email for privacy requests]` (privacy@soulmates.quest is named, marked "[address being set up]")
- [ ] `[MISSING: lawful basis — to be confirmed by counsel]` (free-reading processing)
- [ ] `[MISSING: lawful basis for the quiz — to be confirmed by counsel]` (soulmate quiz answers from friends)
- [ ] Quiz retention: 12 months is a proposed period, pending review. The consent text on `/quiz` takes the months from the API (`LEXICON_RETENTION_DAYS`); the privacy page states 12 and must be updated if that changes
- [ ] `[MISSING: hosting log retention period]` (Vercel request logs)
- [ ] `[MISSING: email provider and retention period]` (mail sent to hello@soulmates.quest; still `[to be confirmed]` in Privacy §11–12)
- [ ] `[MISSING: applicable law, data subject rights wording and how to exercise them — to be confirmed by counsel]`
- [ ] `[MISSING: supervisory authority confirmation]`
- [ ] `[MISSING: effective date]`

## Terms (now `src/content/legal/terms.{en,bg}.md`)

- [x] `[MISSING: legal entity name]` (REAL4LIFE LTD, in the texts since 18 Oct 2026)
- [x] `[MISSING: registered address]`
- [x] `[MISSING: company registration number]` (UK company 15724723)
- [x] `[MISSING: minimum age for the future app]` (18 or over, Terms §2). The product guardrail in PRODUCT_REINVENTION §8 says under-18s can't use matching; this needs confirming.
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
- Local storage keys: `sq.visitor`, `sq.tarot.daily`, `sq.tarot.draw.1`, `sq.tarot.draw.3` (`src/lib/readings/tarotStorage.ts`, via `src/lib/readings/local.ts`) and the analytics choice `sq.consent.analytics` (`src/lib/site/consent.ts`). No advertising scripts. Fonts are self-hosted by `next/font`.
- Analytics (corrected 22 Oct 2026): Vercel Web Analytics without cookies, and Google Analytics with `_ga` cookies only after the visitor accepts the cookie banner (`src/components/site/SiteAnalytics.tsx`; owner decision 19 Oct 2026). Privacy §4 and §15 describe this.
- The site and the API are hosted on Vercel.
