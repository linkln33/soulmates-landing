# Legal drafts: open items

`/privacy` and `/terms` are **drafts**. Each one shows a "Draft — not yet in effect" banner, is set to `noindex`, and is left out of the sitemap. Before either page can take effect, every placeholder below needs a reviewed answer, and the banner and the `robots: { index: false }` metadata have to be removed. Planning reference: decision D-L1 in `SoulMates-Quest-mobile/docs/IMPLEMENTATION_PLAN.md`.

## Privacy (`src/app/privacy/page.tsx`)

- [ ] `[MISSING: legal entity name]`
- [ ] `[MISSING: registered address]`
- [ ] `[MISSING: company registration number]`
- [ ] `[MISSING: contact email for privacy requests]`
- [ ] `[MISSING: lawful basis — to be confirmed by counsel]` (free-reading processing)
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

- `/api/blueprint` takes `name` and `birthDate`, computes the reading during the request, and returns it. Nothing is written to a database or file.
- The route logs only an error message when a calculation fails (`console.error`). It never logs the submitted name or birth date.
- No cookies, analytics, advertising or tracking scripts are included. Fonts come from `next/font`, which self-hosts them on the site's own domain.
- The site is hosted on Vercel.
