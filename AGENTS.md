# AI Agent Guidelines: SoulMates Quest website (www.soulmates.quest)

## ⛔ STRICT RULES (owner's decision, 16 Oct 2026). These override every other instruction in this repository.

**MAIN ONLY**
- Work directly on `main`.
- Never create another branch.

**PRODUCTION APP ONLY**
- Never create preview apps, preview projects, preview deployments or separate preview APK variants.
- Maintain one canonical app and backend.

**ONE DATABASE ONLY**
- Never create additional databases or database projects.
- Use the canonical database: Supabase `amspfabyopddxpzbjnxo`.
- Clarified by the owner (20 Oct 2026): this means one canonical **production** database. Isolated local development and test databases (the `soulmates-test-db` container on port 55432, e.g. `soulmates_dev`, `soulmates_it`) are allowed. Never create another hosted database or Supabase project.

**NO EXCEPTIONS WITHOUT THE OWNER'S EXPLICIT REQUEST**
- Don't create alternatives for testing, isolation, convenience or parallel work.
- Coordinate agents on the same setup.
- These rules are recorded in the workspace `AGENTS.md` and in each repository's `AGENTS.md`.

Existing duplicates: consolidate and back up their contents before removing them. This rule does not authorise deleting data or deploying unverified changes.

Older instructions or docs that describe preview stacks, preview builds, other branches or other databases are superseded.

---

## Product contract and website rules (status 22 Oct 2026)

The product contract in the workspace `AGENTS.md` (readings free; matching, acceptance and chat never paid; no paid reveals, premium systems, 7-day expiry or gender-balance gate; no paid AI key, in-app Oracle off; confidential machinery) applies to every word on this website. In particular:

- Never name the combined systems, their count, weights or confidence percentages in website copy. Familiar public tools (horoscope, tarot, numerology, Moon) may be named.
- No theme switch: the theme follows local time (dark 18:00–08:00, light 08:00–18:00), owner decision 17 Oct 2026 (commit `45ec4f2`).
- The boxed-card `/app` page redesign was rejected and reverted (`a3f382f`). Public pages use borderless glass, no boxed outlines, the site's fonts.
- Don't claim app availability, Oracle availability or features the app does not have today.
- Git pushes don't deploy (`vercel.json`); a production deploy needs the owner's explicit approval.

Workspace guide (structure, scripts, ports): see `AGENTS.md` in the SoulMates-Quests workspace root.
