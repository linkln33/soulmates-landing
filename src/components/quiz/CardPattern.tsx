/** Decorative crescent and stars for a card corner. Hidden from assistive tech. */
export default function CardPattern() {
  return (
    <svg className="lx-pattern" viewBox="0 0 120 64" aria-hidden="true" focusable="false">
      <path d="M92 10a20 20 0 1 0 18 28 16 16 0 1 1-18-28z" fill="currentColor" opacity="0.55" />
      <path d="M58 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="currentColor" />
      <path d="M74 44l1.4 3.6 3.6 1.4-3.6 1.4L74 54l-1.4-3.6L69 49l3.6-1.4z" fill="currentColor" opacity="0.8" />
      <circle cx="44" cy="36" r="1.6" fill="currentColor" opacity="0.7" />
      <circle cx="112" cy="54" r="1.3" fill="currentColor" opacity="0.7" />
      <circle cx="84" cy="6" r="1.2" fill="currentColor" opacity="0.6" />
    </svg>
  );
}
