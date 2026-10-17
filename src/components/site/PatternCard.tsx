/**
 * Softly tinted card with a botanical/celestial corner motif and sparkles,
 * like the app's components/ui/PatternCard. Motif artwork is synced from the
 * app (src/content/app/patterns.json), drawn in currentColor and hidden from
 * assistive technology. Placement follows the app's lib/design/patterns.ts.
 */
import type { CSSProperties, ReactNode } from 'react';
import PATTERNS from '@/content/app/patterns.json';

export type CardTint = 'plain' | 'pink' | 'teal' | 'violet' | 'amber';
export type CardMotif = 'sprig' | 'palm' | 'feather' | 'crown' | 'diamond' | 'lotus' | 'constellation';
type PatternKey = keyof typeof PATTERNS;

const PLACEMENT: Record<CardMotif, { width: number; height: number; top: number; right: number; flip?: boolean; rotate?: string }> = {
  sprig: { width: 92, height: 92, top: -30, right: -26, flip: true },
  palm: { width: 96, height: 96, top: -32, right: -30, flip: true },
  feather: { width: 90, height: 90, top: -30, right: -28, flip: true },
  crown: { width: 42, height: 37, top: -3, right: 6, rotate: '12deg' },
  diamond: { width: 44, height: 39, top: -4, right: 4 },
  lotus: { width: 52, height: 36, top: -2, right: 2 },
  constellation: { width: 60, height: 44, top: -8, right: 0 },
};

const DEFAULT_MOTIF: Record<CardTint, CardMotif> = {
  plain: 'lotus',
  pink: 'sprig',
  teal: 'palm',
  violet: 'constellation',
  amber: 'feather',
};

/** One synced pattern as inline SVG (trusted, build-time content). */
export function Pattern({ name, className, style }: { name: PatternKey; className?: string; style?: CSSProperties }) {
  const p = PATTERNS[name];
  return (
    <svg
      className={className}
      style={style}
      viewBox={p.viewBox}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: p.body }}
    />
  );
}

export default function PatternCard({
  tint = 'plain',
  motif,
  scale = 1.25,
  className = '',
  as: Tag = 'section',
  children,
  ...rest
}: {
  tint?: CardTint;
  motif?: CardMotif | null;
  /** Web cards are larger than the app's, so motifs are scaled up a little. */
  scale?: number;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'aside';
  children: ReactNode;
} & Record<`aria-${string}`, string | undefined>) {
  const m = motif === null ? null : motif ?? DEFAULT_MOTIF[tint];
  const place = m ? PLACEMENT[m] : null;
  return (
    <Tag className={`card card-${tint} ${className}`} {...rest}>
      {m && place ? (
        <Pattern
          name={m}
          className="motif"
          style={{
            width: place.width * scale,
            height: place.height * scale,
            top: place.top * scale,
            right: place.right * scale,
            transform: [place.flip ? 'scaleY(-1)' : '', place.rotate ? `rotate(${place.rotate})` : ''].join(' ').trim() || undefined,
          }}
        />
      ) : null}
      <Pattern name="sparkles" className="motif motif-sparkles" />
      <div className="card-content">{children}</div>
    </Tag>
  );
}
