// Pure inline SVG icons — no library, no 'use client' needed
import React from 'react';
type P = { size?: number };

// Western Astrology — purple planet with golden orbital ring
function IcoPlanet({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5.5" fill="#C084FC"/>
      <circle cx="10" cy="10" r="2.2" fill="#9333EA" opacity="0.55"/>
      <ellipse cx="12" cy="12" rx="10.5" ry="3.2" stroke="#FCD34D" strokeWidth="1.8" transform="rotate(-28 12 12)" fill="none"/>
    </svg>
  );
}
// Numerology — bold gold hash
function IcoHash({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <line x1="9"  y1="4"  x2="7"  y2="20" stroke="#F59E0B" strokeWidth="2.8"/>
      <line x1="17" y1="4"  x2="15" y2="20" stroke="#F59E0B" strokeWidth="2.8"/>
      <line x1="4"  y1="9"  x2="20" y2="9"  stroke="#FBBF24" strokeWidth="2.8"/>
      <line x1="4"  y1="15" x2="20" y2="15" stroke="#FBBF24" strokeWidth="2.8"/>
    </svg>
  );
}
// Tarot — stacked cards with eye
function IcoCards({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="4" y="3" width="12" height="16" rx="2" fill="#7C3AED"/>
      <rect x="8" y="5" width="12" height="16" rx="2" fill="#A855F7" stroke="#C084FC" strokeWidth="0.8"/>
      <ellipse cx="14" cy="12.5" rx="3.2" ry="2.2" fill="none" stroke="#FCD34D" strokeWidth="1.3"/>
      <circle cx="14" cy="12.5" r="1.1" fill="#FCD34D"/>
    </svg>
  );
}
// Elemental / fire — orange-amber flame
function IcoFire({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2c0 5-5 6-5 11a7 7 0 0 0 14 0c0-4-3-6-3-9-2 3-2.5 4.5-4 6.5-1-2.5-2-5-2-8.5z" fill="#F97316"/>
      <path d="M12 11c-1 2-1.5 3.5-0.5 5a3 3 0 0 0 4-0.5c0.8-2-0.3-3.5-3.5-4.5z" fill="#FCD34D"/>
    </svg>
  );
}
// Love Language — pink speech bubble with heart
function IcoHeart2({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 4h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8.5L4 20.5V5a1 1 0 0 1 1-1z" fill="#EC4899"/>
      <path d="M12 8.5c-.7-1.2-2.3-1.2-3 0-.6 1.2.7 2.5 3 4 2.3-1.5 3.6-2.8 3-4-.7-1.2-2.3-1.2-3 0z" fill="white"/>
    </svg>
  );
}
// Attachment Style — teal chain links
function IcoLink({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M9 17H7a5 5 0 0 1 0-10h2"  stroke="#22D3EE" strokeWidth="2.5" fill="none"/>
      <path d="M15 7h2a5 5 0 0 1 0 10h-2" stroke="#22D3EE" strokeWidth="2.5" fill="none"/>
      <line x1="8" y1="12" x2="16" y2="12" stroke="#67E8F9" strokeWidth="2.5"/>
    </svg>
  );
}
// Big Five — purple brain
function IcoBrain({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M9 4C6 4 4 6.5 4 9c0 1 .4 2 1.1 2.8C3.8 12.6 3 14 3 15.5 3 18 5 20 7.5 20H9" stroke="#A855F7" strokeWidth="1.9" fill="none"/>
      <path d="M15 4c3 0 5 2.5 5 5 0 1-.4 2-1.1 2.8C20.2 12.6 21 14 21 15.5 21 18 19 20 16.5 20H15" stroke="#A855F7" strokeWidth="1.9" fill="none"/>
      <line x1="12" y1="4" x2="12" y2="20" stroke="#C084FC" strokeWidth="1.4" strokeDasharray="2.5 2"/>
      <path d="M9 20c1.5-3.5 1.5-7 0-10 2 .6 4 .6 6 0-1.5 3-1.5 6.5 0 10" stroke="#A855F7" strokeWidth="1.9" fill="none"/>
    </svg>
  );
}
// Values — gold compass rose
function IcoCompass({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" stroke="#F59E0B" strokeWidth="1.4" fill="none"/>
      <polygon points="12,2.5 13.5,10.5 12,9.5 10.5,10.5" fill="#F59E0B"/>
      <polygon points="12,21.5 10.5,13.5 12,14.5 13.5,13.5" fill="#9CA3AF"/>
      <polygon points="2.5,12 10.5,10.5 9.5,12 10.5,13.5" fill="#9CA3AF"/>
      <polygon points="21.5,12 13.5,13.5 14.5,12 13.5,10.5" fill="#F59E0B" opacity=".8"/>
      <circle cx="12" cy="12" r="1.8" fill="#FCD34D"/>
    </svg>
  );
}
// Lifestyle — amber sunrise
function IcoSun({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M5.5 14a6.5 6.5 0 0 1 13 0" fill="#FCD34D" stroke="none"/>
      <path d="M5.5 14a6.5 6.5 0 0 1 13 0" fill="none" stroke="#F59E0B" strokeWidth="2"/>
      <line x1="2"  y1="14" x2="22" y2="14" stroke="#F59E0B" strokeWidth="2"/>
      <line x1="12" y1="2"  x2="12" y2="5"  stroke="#F59E0B" strokeWidth="2"/>
      <line x1="3.5" y1="5.5" x2="5.7" y2="7.7"  stroke="#F59E0B" strokeWidth="2"/>
      <line x1="20.5" y1="5.5" x2="18.3" y2="7.7" stroke="#F59E0B" strokeWidth="2"/>
      <line x1="2"  y1="18" x2="22" y2="18" stroke="#F59E0B" strokeWidth="1.2" opacity=".4"/>
    </svg>
  );
}
// Consciousness — yin-yang indigo/lavender
function IcoYin({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9.5" fill="#7C3AED"/>
      <path d="M12 2.5a9.5 9.5 0 0 1 0 19 4.75 4.75 0 0 1 0-9.5 4.75 4.75 0 0 0 0-9.5z" fill="#EDE9FE"/>
      <circle cx="12" cy="7.25"  r="1.7" fill="#7C3AED"/>
      <circle cx="12" cy="16.75" r="1.7" fill="#EDE9FE"/>
      <circle cx="12" cy="12" r="9.5" stroke="#A78BFA" strokeWidth="0.8" fill="none"/>
    </svg>
  );
}
// Vedic moon — indigo crescent + gold stars
function IcoMoon({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3a9 9 0 1 0 6.7 15.1A7.5 7.5 0 1 1 12 3z" fill="#818CF8"/>
      <path d="M19.5 6.5l.8 1.8 1.8.7-1.8.7-.8 1.8-.8-1.8-1.8-.7 1.8-.7z" fill="#FCD34D"/>
      <path d="M17 2.5l.5 1.2 1.3.5-1.3.5-.5 1.2-.5-1.2-1.3-.5 1.3-.5z" fill="#FCD34D" opacity=".8"/>
    </svg>
  );
}
// Human Design — geometric body graph nodes
function IcoTree({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <circle cx="12" cy="3.5"  r="2"   fill="#38BDF8"/>
      <circle cx="6.5" cy="10" r="2"   fill="#0EA5E9"/>
      <circle cx="17.5" cy="10" r="2"  fill="#0EA5E9"/>
      <circle cx="12"  cy="16" r="2"   fill="#38BDF8"/>
      <circle cx="7"   cy="21" r="1.5" fill="#7DD3FC"/>
      <circle cx="17"  cy="21" r="1.5" fill="#7DD3FC"/>
      <line x1="12"  y1="5.5"  x2="6.5"  y2="8"   stroke="#38BDF8" strokeWidth="1.5"/>
      <line x1="12"  y1="5.5"  x2="17.5" y2="8"   stroke="#38BDF8" strokeWidth="1.5"/>
      <line x1="6.5" y1="12"   x2="12"   y2="14"  stroke="#38BDF8" strokeWidth="1.5"/>
      <line x1="17.5" y1="12"  x2="12"   y2="14"  stroke="#38BDF8" strokeWidth="1.5"/>
      <line x1="7"   y1="18.5" x2="7"    y2="21"  stroke="#7DD3FC" strokeWidth="1.5"/>
      <line x1="17"  y1="18.5" x2="17"   y2="21"  stroke="#7DD3FC" strokeWidth="1.5"/>
    </svg>
  );
}
// Gene Keys — emerald spiral
function IcoSpiral({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 12 Q15 5 12 3 Q7 1.5 5.5 6 Q3.5 12 8 16 Q13.5 21 20 17 Q24.5 12.5 22 6 Q19 -1 11 2" stroke="#10B981" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <circle cx="12" cy="12" r="1.8" fill="#34D399"/>
    </svg>
  );
}
// Chakra — layered lotus petals
function IcoLotus({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <ellipse cx="12" cy="15" rx="2.8" ry="4.2" fill="#F472B6"/>
      <ellipse cx="12" cy="15" rx="2.8" ry="4.2" fill="#F472B6"  transform="rotate(60 12 15)"/>
      <ellipse cx="12" cy="15" rx="2.8" ry="4.2" fill="#C084FC"  transform="rotate(-60 12 15)"/>
      <ellipse cx="12" cy="15" rx="2.8" ry="4.2" fill="#F9A8D4"  transform="rotate(120 12 15)" opacity=".7"/>
      <ellipse cx="12" cy="15" rx="2.8" ry="4.2" fill="#E879F9"  transform="rotate(-120 12 15)" opacity=".7"/>
      <circle cx="12" cy="13.5" r="2.8" fill="#FCD34D"/>
      <circle cx="12" cy="13.5" r="1.2" fill="#F59E0B"/>
    </svg>
  );
}
// Past Life — butterfly wings
function IcoButterfly({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 12 Q5.5 4 1.5 6 Q-1 11 3.5 13.5 Q8 16 12 12z"  fill="#F472B6" opacity=".95"/>
      <path d="M12 12 Q18.5 4 22.5 6 Q25 11 20.5 13.5 Q16 16 12 12z" fill="#C084FC" opacity=".95"/>
      <path d="M12 12 Q7 17.5 3 17.5 Q1.5 21 6 21 Q10 21 12 12z"    fill="#F9A8D4" opacity=".9"/>
      <path d="M12 12 Q17 17.5 21 17.5 Q22.5 21 18 21 Q14 21 12 12z"  fill="#DDD6FE" opacity=".9"/>
      <line x1="12" y1="7" x2="12" y2="19" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/>
      <ellipse cx="12" cy="5.5" rx="1" ry="2" fill="#7C3AED" transform="rotate(-20 12 5.5)"/>
      <ellipse cx="12" cy="5.5" rx="1" ry="2" fill="#7C3AED" transform="rotate(20 12 5.5)"/>
    </svg>
  );
}
// Available — green heart
function IcoHeart({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 21S3 14.5 3 9a4.5 4.5 0 0 1 9-.5 4.5 4.5 0 0 1 9 .5c0 5.5-9 12-9 12z" fill="#4ADE80"/>
      <path d="M7 9c0-1 .5-2 1.5-2.5" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
// Taken — sky-blue padlock
function IcoLock({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2.5" fill="#38BDF8"/>
      <path d="M8 11V7.5a4 4 0 0 1 8 0V11" stroke="#0EA5E9" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      <circle cx="12" cy="16.5" r="1.8" fill="#0C4A6E"/>
      <line x1="12" y1="16.5" x2="12" y2="19" stroke="#0C4A6E" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
// GPS — green map pin
function IcoPin({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2a7.5 7.5 0 0 1 7.5 7.5C19.5 15 12 22 12 22S4.5 15 4.5 9.5A7.5 7.5 0 0 1 12 2z" fill="#4ADE80"/>
      <circle cx="12" cy="9.5" r="3" fill="white"/>
      <circle cx="12" cy="9.5" r="1.3" fill="#16A34A"/>
    </svg>
  );
}
// Soulmate Radar — purple broadcast arcs + center dot
function IcoRadar({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M4.2 4.2a11 11 0 0 0 0 15.6" stroke="#C084FC" strokeWidth="2"/>
      <path d="M19.8 4.2a11 11 0 0 1 0 15.6" stroke="#C084FC" strokeWidth="2"/>
      <path d="M7.5 7.5a7 7 0 0 0 0 9"    stroke="#A855F7" strokeWidth="2"/>
      <path d="M16.5 7.5a7 7 0 0 1 0 9"   stroke="#A855F7" strokeWidth="2"/>
      <circle cx="12" cy="12" r="2.2" fill="#E879F9"/>
      <circle cx="12" cy="12" r="1"   fill="white"/>
    </svg>
  );
}
// Response Streaks — amber lightning bolt
function IcoLightning({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.5 2L4 14h7.5L10 22l10-12h-7.5L13.5 2z" fill="#F59E0B" stroke="#FBBF24" strokeWidth=".6" strokeLinejoin="round"/>
    </svg>
  );
}
// Match Revival — pink circular arrow
function IcoRefresh({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 12a8 8 0 1 1-2.5-5.8" stroke="#F472B6" strokeWidth="2.5" fill="none"/>
      <polyline points="21 3 21 9 15 9" stroke="#F472B6" strokeWidth="2.5" fill="none"/>
    </svg>
  );
}
// Quiz CTA — gold 4-point sparkle
function IcoSparkle({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2l2 8 8 2-8 2-2 8-2-8-8-2 8-2z" fill="#F59E0B"/>
      <path d="M19.5 3l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" fill="#FCD34D" opacity=".75"/>
    </svg>
  );
}
// Notifications — orange bell with ring arcs
function IcoBell({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <path d="M12 3a6 6 0 0 1 6 6v4.5L20 16H4l2-2.5V9a6 6 0 0 1 6-6z" fill="#FB923C"/>
      <path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" stroke="#F97316" strokeWidth="1.6" fill="none"/>
      <path d="M5.5 10.5Q5 9 5.5 7.5" stroke="#FED7AA" strokeWidth="1.5" opacity=".7"/>
    </svg>
  );
}
// Compatibility Score — purple balance scales
function IcoScales({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <line x1="12" y1="3" x2="12" y2="21" stroke="#A855F7" strokeWidth="2"/>
      <line x1="3.5" y1="7" x2="20.5" y2="7" stroke="#C084FC" strokeWidth="2"/>
      <path d="M3.5 7L6.5 13.5H.5z"   fill="#A855F7"/>
      <path d="M20.5 7L23.5 13.5H17.5z" fill="#C084FC"/>
      <rect x="9" y="19" width="6" height="2" rx="1" fill="#7C3AED"/>
      <circle cx="12" cy="7" r="1.2" fill="#FCD34D"/>
    </svg>
  );
}
// One person — teal user with focus ring
function IcoUser({ size = 24 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round">
      <circle cx="12" cy="7.5" r="4" fill="#2DD4BF"/>
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#14B8A6"/>
      <circle cx="12" cy="12" r="10" stroke="#5EEAD4" strokeWidth="1.2" fill="none" strokeDasharray="3 2.5"/>
    </svg>
  );
}

const MAP: Record<string, (p: P) => React.JSX.Element> = {
  planet: IcoPlanet, hash: IcoHash, cards: IcoCards, fire: IcoFire,
  heart2: IcoHeart2, link: IcoLink, brain: IcoBrain, compass: IcoCompass,
  sun: IcoSun, yin: IcoYin, moon: IcoMoon, tree: IcoTree, spiral: IcoSpiral,
  lotus: IcoLotus, butterfly: IcoButterfly,
  heart: IcoHeart, lock: IcoLock,
  pin: IcoPin, radar: IcoRadar, lightning: IcoLightning,
  refresh: IcoRefresh, sparkle: IcoSparkle, bell: IcoBell,
  scales: IcoScales, user: IcoUser,
};

export function Ico({ k, s = 18 }: { k: string; s?: number }) {
  const C = MAP[k];
  return C ? <C size={s} /> : null;
}
