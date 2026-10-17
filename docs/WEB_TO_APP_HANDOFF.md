# Website → app handoff: design proposal

Status: **proposal, not built** (17 Oct 2026). Needs the owner's approval before any backend or app work. It does not block the free readings, which are complete without it.

## What the owner has decided

- **Journey:** free website tools, then sign-up in the app, then the 48–52% balance check, then admission or the waitlist, then gradual profile completion.
- **No linking by typed email.** Accounts are never linked or claimed because an email address matches.
- **Separate consents:**
  - Email subscription is separate from an app account.
  - Marketing consent is separate from moving reading data into the app.
- **Nothing puts anyone into matching** except explicit consent given in the app.

## Principles

1. **Verified identity first.** A claim is redeemed only by a signed-in account, through Google or email and password, using the app's normal sign-in. Both sign-in methods take the same path afterwards.
2. **One-time, expiring claim token.**
   - The token is 32 random bytes, base64url.
   - The server stores only its SHA-256 hash.
   - It can be used once and expires (proposed: 24 hours).
   - The token carries no personal data. Birth data never appears in a URL.
3. **Review before import.**
   - After sign-in, the app shows what the website would import, next to anything already in the profile.
   - Nothing is written until the member confirms.
   - An existing value is never overwritten silently. For each field the member chooses "keep mine" or "use this one", and "keep mine" is the default.
4. **Minimum data.**
   - A claim holds only what the visitor chose to carry over.
   - Possible contents: the reading keys (sign, card keys and orientation, numbers) and, only if they ask, their birth date.
   - It never holds matching data or anything derived from it.
5. **No matching side effects.** Redeeming a claim never records matching consent, never changes admission status and never adds anyone to introductions.

## Flow

```
Website result
  → "Continue in the app"   (one invitation per result; optional)
  → consent sheet: "Send this reading to the app" [checkbox, unticked]
                   (service-data transfer only; no marketing wording)
  → POST /api/public/claims            { kind, items }      rate-limited, ≤2kb
      ← { token, expiresAt }           server stores sha256(token), items, expiry
  → website shows: open-in-app link (/claim#<token>) + short code for manual entry
App
  → opens with the token (universal link; fragment, so it never reaches server logs)
  → sign-in or sign-up (Google or password; same path afterwards)
  → GET  /api/claims/preview   { token }   authenticated; shows items + current profile values
  → review screen: per field "keep mine" (default) / "use this one"; Confirm or Discard
  → POST /api/claims/redeem    { token, choices }   authenticated, atomic, single-use
      ← writes only the confirmed fields; marks the claim consumed by this user
  → normal admission check (48–52% rule) → admitted or waitlist
```

- **Expired or used tokens:** the app says the link has expired and offers to continue without it. The readings can be recreated in the app.
- **Discard:** the claim is deleted immediately.
- **Expiry:** unredeemed claims are deleted at expiry by a scheduled job.

## Preserving an anonymous reading

- **Website card of the day:**
  - It follows daily-tarot v2, seeded by the browser's random visitor identifier (`web:<uuid>`).
  - The app's card follows the same rule, seeded by the member's account.
  - Claim item: `{ type: 'tarot_daily', date, key, orientation }`.
  - On the claim day, the app shows the imported card as today's card, marked "from the website", so the card doesn't change mid-day.
  - From the next local day, the account's own daily card applies.
  - The visitor identifier itself is not sent or stored.
- **One- and three-card draws:** imported as saved readings (`{ type: 'tarot_draw', drawnAt, cards }`). The question is included only if the visitor ticks "include my question".
- **Horoscope and Moon:** nothing to carry over beyond the chosen sign. The app derives the sign from the birth date in the profile.
- **Numbers:**
  - The birth date is included only if the visitor chooses it.
  - On review it is shown against any birth date already in the profile, and never replaces one without the member confirming.

## Email subscription (separate, later)

- It is a separate table and separate double opt-in, with no link to accounts or to matching.
- It is blocked until a sender and a content pipeline exist. Today there is no email provider, and `hello@soulmates.quest` is only a contact address.
- The website must not promise daily email readings before then.

## Open decisions for the owner

1. **Token lifetime:** 24 hours is proposed. The discovery-code plan used 30 days.
2. **Delivery when the app isn't installed:**
   - The app isn't publicly available yet, so a claim made now would usually expire before the visitor can use it.
   - **Proposal:** build the claim endpoints when the store listing exists, not before.
3. **Imported birth dates:** whether the review screen may import a birth date at all, or only reading keys.
