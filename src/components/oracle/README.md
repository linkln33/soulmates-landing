# SoulMates Oracle component

A single crystal ball of deep amethyst glass with a restrained teal and raspberry light inside, a warm-gold rim and cradle, and a small gold star suspended at its centre. Inline SVG, crisp at any size. Not placed on any live page yet.

Review page (dev only, 404 in production, noindex, not in the sitemap): `npm run dev -- -p 3311`, then `http://localhost:3311/internal/oracle?theme=light` (or `dark`). Screenshots: `scripts/oracle-screenshots.mjs`.

> **Status (22 Oct 2026).** The in-app Oracle is off (no paid AI key; testers only; monetization undecided; see the workspace `AGENTS.md`). The default `unavailable` note, "The Oracle is available in the app." (`ORACLE_UNAVAILABLE_TEXT` in `OracleCard.tsx`), is therefore not true for members today: pass an accurate `unavailableText`, or keep the component off public pages, until the owner decides.

## Use

```tsx
import { OracleBadge, OracleCard, OracleOrb } from '@/components/oracle';

<OracleOrb variant="main" size="icon" />                // decorative artwork only (aria-hidden)
<OracleBadge variant="ask" size={64} label="Ask" />      // artwork + visible text label
<OracleCard availability="unavailable" />               // "The Oracle is available in the app."
<OracleCard availability="available" href="…" ctaLabel="Open the Oracle" />
```

- `variant`: `main` | `ask` (small speech cue outside the ball) | `connection` (two fine arcs converging above the ball). The ball has the same size and position in every variant.
- `size`: `'icon'` 40 px, `'small'` 64 px, `'large'` 120 px (default), a number of pixels or any CSS length.
- `entrance`: the one-time inner-light sweep when it appears (default on).
- `OracleCard.availability` is required and must be the real state. `available` shows a button (a link with `href`); `unavailable` shows a note, not a disabled button. Nothing in the component claims the Oracle is available or purchasable; don't add prices or predictions around it.
- Labels are real text outside the artwork. For a clickable orb, wrap it in a link or button with the class `oracle-press`; focus uses the site's visible focus ring.

## Rules

- No eyes, hands, tarot cards, text inside the ball, or fake predictions.
- Motion: the entrance sweep runs once (`--oracle-sweep-duration`, 640 ms), then the ball is still. Hover runs one brief glow compression; pressing holds it. No perpetual pulse, spin or particles. `prefers-reduced-motion` turns both off.
- Public pages: borderless glass, no boxed outlines, the site's fonts.

## Tokens (`oracle.css`)

| Token | Light | Dark |
|---|---|---|
| `--oracle-amethyst-1` → `--oracle-amethyst-2` | #2A1B6E → #0E0A2E | same |
| `--oracle-core` | #7B5CFF | same |
| `--oracle-raspberry` / `--oracle-teal` | #FF0050 / #4FD2F6 | same |
| `--oracle-gold-1` → `--oracle-gold-2` | #F5D68A → #B8862E | same |
| `--oracle-surround` | #FBF6EC ivory | #140A1A plum |
| `--oracle-ink` / `--oracle-ink-muted` | #22142E / #5A4A63 | #F6EEF8 / #C6B5CC |
| `--oracle-size-icon` / `-small` / `-large` | 40 / 64 / 120 px | |
| `--oracle-sweep-duration` / `-delay` | 640 ms / 120 ms | |
| `--oracle-compress-duration` / `--oracle-press-duration` | 220 ms / 120 ms | |

The theme follows the site (`<html data-theme>`, from local time); a subtree can be pinned with `data-theme="light"` or `"dark"`.

## shadcn/ui

`components.json` is at the repo root; the primitives are in `src/components/ui` (`button`, `card`), adapted to the site: pill buttons, a borderless glass card and the site's colour tokens (`ui.css`). Tailwind runs only for `src/components/ui` and `src/components/oracle`, without preflight, so the rest of the site is unchanged. Add more primitives with `npx shadcn@latest add <name>` and check the result: the CLI once resolved `cn` to an unrelated npm package; it must import `cn` from `@/lib/utils`.
