/**
 * CSS custom properties generated from the app's design tokens
 * (src/content/app/tokens.json, synced from the app's lib/design/tokens.ts).
 * The theme follows the visitor's local time (THEME_SCRIPT sets
 * <html data-theme>): dark 18:00–08:00, light 08:00–18:00. There is no
 * manual switch. Without JavaScript the device's colour scheme applies.
 */
import tokens from '@/content/app/tokens.json';

type Scheme = typeof tokens.light;

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

function schemeVars(c: Scheme): string {
  const vars: string[] = [];
  const flat = ['background', 'surface', 'surfaceMuted', 'surfacePink', 'surfaceTeal', 'border', 'text', 'textMuted',
    'textSubtle', 'primary', 'primaryPressed', 'onPrimary', 'secondary', 'secondaryText', 'link', 'danger', 'overlay', 'meterTrack'] as const;
  for (const key of flat) vars.push(`--${kebab(key)}:${c[key]}`);
  for (const [group, values] of [['meter', c.meter], ['tile', c.tile], ['theme', c.theme]] as const) {
    for (const [k, v] of Object.entries(values)) vars.push(`--${group}-${kebab(k)}:${v}`);
  }
  for (const [tint, v] of Object.entries(c.card)) {
    vars.push(`--card-${tint}-bg:${v.background}`, `--card-${tint}-pattern:${v.pattern}`, `--card-${tint}-icon:${v.icon}`, `--card-${tint}-icon-bg:${v.iconBackground}`);
  }
  return vars.join(';');
}

const shared = [
  ...Object.entries(tokens.palette).map(([k, v]) => `--palette-${kebab(k)}:${v}`),
  ...Object.entries(tokens.radii).map(([k, v]) => `--r-${k}:${v}px`),
  ...Object.entries(tokens.spacing).map(([k, v]) => `--s-${k}:${v}px`),
].join(';');

const light = schemeVars(tokens.light);
const dark = schemeVars(tokens.dark);

export const TOKENS_CSS = [
  `:root{${shared};${light};color-scheme:light;--shadow-1:0 3px 10px rgba(15,26,46,.06);--shadow-2:0 8px 18px rgba(15,26,46,.10)}`,
  `@media (prefers-color-scheme:dark){:root:not([data-theme]){${dark};color-scheme:dark;--shadow-1:none;--shadow-2:none}}`,
  `:root[data-theme="dark"]{${dark};color-scheme:dark;--shadow-1:none;--shadow-2:none}`,
].join('\n');
