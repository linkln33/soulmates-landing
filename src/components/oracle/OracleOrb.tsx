/**
 * The SoulMates Oracle artwork: one crystal ball of deep amethyst glass with a
 * restrained teal and raspberry light inside, a warm-gold rim and cradle, and
 * a small gold star suspended at its centre. Inline SVG, crisp at any size.
 *
 * Decorative only (aria-hidden): labels are real text outside the artwork
 * (see OracleBadge and OracleCard). Colours, sizes and motion come from the
 * --oracle-* tokens in oracle.css. The ball never shows eyes, hands, cards,
 * text or anything that looks like an answer being worked out.
 */
import { useId, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import './oracle.css';

export type OracleVariant = 'main' | 'ask' | 'connection';

export const ORACLE_SIZES = { icon: 40, small: 64, large: 120 } as const;

export interface OracleOrbProps {
  variant?: OracleVariant;
  /** Width and height: a number of CSS pixels, a named size or any CSS length. Default: 'large' (120 px). */
  size?: number | keyof typeof ORACLE_SIZES | string;
  /** Play the one-time inner-light sweep when it appears. Default true; reduced motion always skips it. */
  entrance?: boolean;
  className?: string;
}

function cssSize(size: OracleOrbProps['size']): string {
  if (size === undefined) return `${ORACLE_SIZES.large}px`;
  if (typeof size === 'number') return `${size}px`;
  if (size in ORACLE_SIZES) return `${ORACLE_SIZES[size as keyof typeof ORACLE_SIZES]}px`;
  return size;
}

/* Ball geometry in the 128-unit view box; the cradle sits under it. */
const CX = 64;
const CY = 58;
const R = 40;

export function OracleOrb({ variant = 'main', size, entrance = true, className }: OracleOrbProps) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const id = (name: string) => `oracle-${uid}-${name}`;
  const url = (name: string) => `url(#${id(name)})`;

  return (
    <span
      className={cn('oracle-orb', entrance && 'oracle-orb--entrance', className)}
      data-variant={variant}
      style={{ '--oracle-size': cssSize(size) } as CSSProperties}
      aria-hidden="true"
    >
      <span className="oracle-orb__halo" />
      <svg className="oracle-orb__art" viewBox="0 0 128 128" focusable="false">
        <defs>
          <radialGradient id={id('glass')} cx="42%" cy="36%" r="68%">
            <stop offset="0" className="oracle-stop-core" />
            <stop offset=".52" className="oracle-stop-amethyst-1" />
            <stop offset="1" className="oracle-stop-amethyst-2" />
          </radialGradient>
          <radialGradient id={id('teal')} cx="34%" cy="70%" r="46%">
            <stop offset="0" className="oracle-stop-teal" stopOpacity=".42" />
            <stop offset="1" className="oracle-stop-teal" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('raspberry')} cx="70%" cy="66%" r="44%">
            <stop offset="0" className="oracle-stop-raspberry" stopOpacity=".32" />
            <stop offset="1" className="oracle-stop-raspberry" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={id('star-glow')} cx="50%" cy="50%" r="50%">
            <stop offset="0" className="oracle-stop-gold-1" stopOpacity=".55" />
            <stop offset="1" className="oracle-stop-gold-1" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={id('gold')} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" className="oracle-stop-gold-1" />
            <stop offset="1" className="oracle-stop-gold-2" />
          </linearGradient>
          <linearGradient id={id('rim')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" className="oracle-stop-gold-1" />
            <stop offset=".55" className="oracle-stop-gold-2" />
            <stop offset="1" className="oracle-stop-gold-1" />
          </linearGradient>
          <linearGradient id={id('sweep')} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff" stopOpacity="0" />
            <stop offset=".5" stopColor="#fff" stopOpacity=".34" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={id('ball')}>
            <circle cx={CX} cy={CY} r={R} />
          </clipPath>
        </defs>

        {variant === 'connection' && (
          <g className="oracle-orb__cue" fill="none" strokeLinecap="round">
            {/* Two fine arcs rising from either side and converging above the ball, without touching. */}
            <path className="oracle-orb__arc oracle-orb__arc--teal" d="M16 96 C 4 58, 22 18, 58 9" />
            <path className="oracle-orb__arc oracle-orb__arc--raspberry" d="M112 96 C 124 58, 106 18, 70 9" />
          </g>
        )}
        {variant === 'ask' && (
          <g className="oracle-orb__cue" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* A small speech cue outside the ball, upper right. */}
            <path
              className="oracle-orb__bubble"
              d="M101 9 h16 a6 6 0 0 1 6 6 v6 a6 6 0 0 1 -6 6 h-9 l-6 5 v-5 h-1 a6 6 0 0 1 -6 -6 v-6 a6 6 0 0 1 6 -6 z"
            />
          </g>
        )}

        {/* Cradle */}
        <path d="M41 96 C 52 104, 76 104, 87 96 L 83 110 C 72 114, 56 114, 45 110 Z" fill={url('gold')} />
        <path d="M45 110 C 56 114, 72 114, 83 110" fill="none" className="oracle-orb__cradle-shade" strokeWidth="1.4" />

        {/* Glass */}
        <circle cx={CX} cy={CY} r={R} fill={url('glass')} />
        <g clipPath={url('ball')}>
          <circle cx={CX} cy={CY} r={R} fill={url('teal')} />
          <circle cx={CX} cy={CY} r={R} fill={url('raspberry')} />
          <circle cx={CX} cy={CY} r="15" fill={url('star-glow')} />
          <rect className="oracle-orb__sweep" x="-12" y="8" width="34" height="100" fill={url('sweep')} />
          <ellipse cx="48" cy="38" rx="13" ry="6.5" fill="#fff" opacity=".2" transform="rotate(-32 48 38)" />
          <circle cx={CX} cy={CY} r={R - 1.8} fill="none" stroke="#fff" strokeOpacity=".1" strokeWidth="1.2" />
        </g>

        {/* Warm-gold rim */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={url('rim')} strokeWidth="2.6" />

        {/* Suspended star */}
        <path
          className="oracle-orb__star"
          d="M64 48 L66.2 55.8 L74 58 L66.2 60.2 L64 68 L61.8 60.2 L54 58 L61.8 55.8 Z"
          fill={url('gold')}
        />
      </svg>
    </span>
  );
}

export interface OracleBadgeProps extends OracleOrbProps {
  /** Visible, accessible label shown under (or beside) the artwork. */
  label: string;
  layout?: 'stacked' | 'inline';
}

/** The artwork with a real text label outside it, for icon-size uses. */
export function OracleBadge({ label, layout = 'stacked', className, ...orb }: OracleBadgeProps) {
  return (
    <span className={cn('oracle-badge', `oracle-badge--${layout}`, className)}>
      <OracleOrb {...orb} />
      <span className="oracle-badge__label">{label}</span>
    </span>
  );
}
