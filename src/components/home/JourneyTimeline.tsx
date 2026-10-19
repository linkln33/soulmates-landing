'use client';

/**
 * A vertical journey of stages: a rail with one node per stage, a glass card
 * of copy beside each node and unboxed artwork on the other side. Stage data
 * comes from the caller, so the same component serves any number of stages.
 *
 * Desktop zig-zags down a centre spine; at 860px and below the spine moves to
 * the left edge and each stage stacks artwork over copy.
 *
 * Motion (adapted from the PrintVes process timeline):
 *  - the rail fills with scroll. The gradient is fixed along the rail and
 *    revealed with clip-path, so the colours stay put as the line grows;
 *  - each node lights when the fill reaches it;
 *  - each stage enters once, when it first comes into view.
 * Scroll writes one custom property and toggles classes on the DOM through
 * requestAnimationFrame; nothing re-renders React while scrolling.
 *
 * Content is visible by default. The hidden pre-entrance state applies only
 * once the effect has set data-motion="on", so the stages still show if
 * JavaScript fails, and reduced motion shows everything settled. Until the
 * rail has been measured (data-rail="measured") CSS draws it as one segment
 * per stage, from node to node, so it never runs past the first or last.
 *
 * All copy is HTML beside the artwork, never baked into the images.
 */
import { useEffect, useRef, type CSSProperties } from 'react';
import './journey.css';

export type JourneyAccent = 'pink' | 'teal' | 'green';

export type JourneyArt = {
  /** Path without width and extension, e.g. /home/journey/inner-world. */
  base: string;
  widths: readonly number[];
  /** Intrinsic size of the largest file; reserves the space. */
  width: number;
  height: number;
  alt: string;
};

export type JourneyStage = {
  key: string;
  /** Step number, rendered as given ("01"). */
  step: string;
  title: string;
  body: string;
  /** Short availability labels, e.g. "Being prepared". */
  statuses?: readonly string[];
  accent: JourneyAccent;
  art?: JourneyArt;
};

const ACCENT_VAR: Record<JourneyAccent, string> = {
  pink: 'var(--journey-pink)',
  teal: 'var(--journey-teal)',
  green: 'var(--journey-green)',
};

const SIZES = '(max-width: 860px) min(88vw, 520px), 40vw';

/** A few brand-coloured pieces from the last node, once. Off unless asked for. */
function celebrate(host: HTMLElement) {
  const layer = document.createElement('span');
  layer.className = 'journey-confetti';
  layer.setAttribute('aria-hidden', 'true');
  const tones = ['pink', 'teal', 'green'];
  for (let i = 0; i < 9; i += 1) {
    const piece = document.createElement('i');
    piece.className = `journey-confetti-piece is-${tones[i % tones.length]}`;
    const angle = (-150 + 15 * i + (Math.random() * 10 - 5)) * (Math.PI / 180);
    const distance = 44 + Math.random() * 36;
    piece.style.setProperty('--dx', `${Math.cos(angle) * distance}px`);
    piece.style.setProperty('--dy', `${Math.sin(angle) * distance}px`);
    piece.style.setProperty('--delay', `${i * 26}ms`);
    layer.append(piece);
  }
  host.append(layer);
  window.setTimeout(() => layer.remove(), 1600);
}

/** Offset of an element's top inside `root`, ignoring transforms. */
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return y;
}

export default function JourneyTimeline({
  stages,
  label,
  celebrateLast = false,
}: {
  stages: JourneyStage[];
  /** Accessible name for the list; the visible heading sits outside it. */
  label: string;
  /** Brand confetti from the last node when it first lights. Off by default. */
  celebrateLast?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const steps = [...root.querySelectorAll<HTMLElement>('.journey-step')];
    const nodes = [...root.querySelectorAll<HTMLElement>('.journey-node')];
    let marks: number[] = nodes.map(() => 0);

    /**
     * Rail geometry: from the first node's centre to the last one's. Nodes sit
     * inside cards of unequal height, so CSS cannot derive this. Measured with
     * offsets rather than rects so an entrance transform in flight does not
     * skew it. Each node's position along the rail is also where it lights.
     */
    const measureRail = () => {
      if (!nodes.length) return;
      const centres = nodes.map((n) => offsetWithin(n, root));
      const head = centres[0];
      const tail = centres[centres.length - 1];
      root.style.setProperty('--rail-top', `${head}px`);
      root.style.setProperty('--rail-bottom', `${Math.max(root.offsetHeight - tail, 0)}px`);
      const span = Math.max(tail - head, 1);
      // A little early, so a node lights as the line arrives rather than after.
      marks = centres.map((c, i) => (i === 0 ? 0 : Math.max((c - head) / span - 0.03, 0)));
      root.dataset.rail = 'measured';
    };
    measureRail();
    const resize = new ResizeObserver(measureRail);
    resize.observe(root);
    for (const step of steps) resize.observe(step);

    const lightAll = () => {
      root.style.setProperty('--journey-progress', '1');
      for (const n of nodes) n.classList.add('is-active');
      for (const s of steps) s.classList.add('is-entered');
    };

    if (reduced.matches) {
      lightAll();
      return () => resize.disconnect();
    }

    // From here on the stages start hidden and enter as they are reached.
    root.dataset.motion = 'on';
    const timers = new Set<number>();
    let celebrated = !celebrateLast;

    const entrance = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-entered');
          entrance.unobserve(entry.target);
        }
      },
      // Several ratios so a fast scroll still catches one of them.
      { threshold: [0.12, 0.3, 0.5, 0.75, 1], rootMargin: '0px 0px -6% 0px' },
    );
    for (const step of steps) entrance.observe(step);

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the band's top reaches the bottom of the screen and is full
      // once its middle reaches the middle, so the last stage lights while it
      // is still being read.
      const start = vh - rect.top;
      const end = vh - (vh / 2 - rect.height / 2);
      const progress = Math.min(Math.max(start / Math.max(end, 1), 0), 1);
      root.style.setProperty('--journey-progress', progress.toFixed(4));
      nodes.forEach((node, i) => {
        const active = progress >= marks[i];
        const was = node.classList.contains('is-active');
        node.classList.toggle('is-active', active);
        if (active && !was && i === nodes.length - 1 && !celebrated) {
          celebrated = true;
          const timer = window.setTimeout(() => celebrate(node), 140);
          timers.add(timer);
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      entrance.disconnect();
      for (const t of timers) clearTimeout(t);
    };
    // Reduced motion can be switched on while the page is open.
    const onPreference = () => {
      if (!reduced.matches) return;
      stop();
      lightAll();
    };
    reduced.addEventListener('change', onPreference);

    return () => {
      stop();
      reduced.removeEventListener('change', onPreference);
      resize.disconnect();
    };
  }, [celebrateLast]);

  const gradient = stages
    .map((s, i) => `${ACCENT_VAR[s.accent]} ${stages.length > 1 ? Math.round((i / (stages.length - 1)) * 100) : 0}%`)
    .join(', ');

  return (
    <div className="journey" ref={ref} style={{ '--journey-gradient': `linear-gradient(180deg, ${gradient})` } as CSSProperties}>
      {/* Decorative: the ordered list already carries the sequence. */}
      <div className="journey-rail" aria-hidden="true">
        <span className="journey-rail-base" />
        <span className="journey-rail-fill" />
      </div>

      <ol className="journey-steps" aria-label={label}>
        {stages.map((stage, i) => (
          <li
            key={stage.key}
            className="journey-step"
            data-stage={stage.key}
            style={{
              '--accent': ACCENT_VAR[stage.accent],
              // Neighbours' colours, for the CSS-only rail segments.
              '--accent-prev': ACCENT_VAR[stages[Math.max(i - 1, 0)].accent],
              '--accent-next': ACCENT_VAR[stages[Math.min(i + 1, stages.length - 1)].accent],
            } as CSSProperties}
          >
            <article className="journey-card">
              {/* Inside the card so it follows the card's own height on both layouts. */}
              <span className="journey-node" data-step={stage.step} aria-hidden="true" />
              <p className="journey-step-number" aria-hidden="true">{stage.step}</p>
              <h3 className="journey-title">
                <span className="visually-hidden">{`${stage.step}. `}</span>
                {stage.title}
              </h3>
              <p className="journey-body">{stage.body}</p>
              {stage.statuses?.length ? (
                <ul className="journey-statuses">
                  {stage.statuses.map((s) => <li key={s} className="journey-status">{s}</li>)}
                </ul>
              ) : null}
            </article>

            {stage.art && (
              // Unboxed: the artwork carries its own light and transparent edges.
              <div className="journey-art">
                <picture>
                  <source
                    type="image/avif"
                    srcSet={stage.art.widths.map((w) => `${stage.art!.base}-${w}.avif ${w}w`).join(', ')}
                    sizes={SIZES}
                  />
                  <img
                    src={`${stage.art.base}-${stage.art.widths[Math.min(1, stage.art.widths.length - 1)]}.webp`}
                    srcSet={stage.art.widths.map((w) => `${stage.art!.base}-${w}.webp ${w}w`).join(', ')}
                    sizes={SIZES}
                    width={stage.art.width}
                    height={stage.art.height}
                    alt={stage.art.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
