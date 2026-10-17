/**
 * The Moon as seen from the northern hemisphere: lit fraction from the
 * server's illumination, lit side from whether the phase is waxing.
 * Decorative (the phase is always stated in text next to it).
 */
import type { PhaseKey } from '@/content/horoscope';

const WAXING: PhaseKey[] = ['new_moon', 'waxing_crescent', 'first_quarter', 'waxing_gibbous'];

export default function MoonDisc({ phase, illumination, size = 140 }: { phase: PhaseKey; illumination: number; size?: number }) {
  const r = 48;
  const k = Math.min(1, Math.max(0, illumination));
  const rx = Math.abs(2 * k - 1) * r;
  const waxing = WAXING.includes(phase);
  // Right-hand semicircle, then the terminator back to the top.
  const lit = `M50 2 A${r} ${r} 0 0 1 50 98 A${rx} ${r} 0 0 ${k > 0.5 ? 1 : 0} 50 2 Z`;
  return (
    <svg className="moon-disc" width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="moon-lit" cx="0.42" cy="0.38" r="0.7">
          <stop offset="0" stopColor="#FFF8E1" />
          <stop offset="1" stopColor="#F2D98B" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r={r} fill="#1E2A4D" />
      {k > 0.01 ? <path d={lit} fill="url(#moon-lit)" transform={waxing ? undefined : 'matrix(-1 0 0 1 100 0)'} /> : null}
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
    </svg>
  );
}
