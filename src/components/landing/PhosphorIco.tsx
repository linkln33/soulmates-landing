const EM: Record<string, string> = {
  // Diff cards
  sun:       '🌟',
  diamond:   '💎',
  user:      '💋',
  bell:      '🌪️',
  pinata:    '🪅',
  scales:    '☯️',
  // Free systems
  planet:    '⛩️',
  hash:      '🧬',
  cards:     '✴️',
  fire:      '🔥',
  heart2:    '💌',
  link:      '💞',
  brain:     '🧠',
  compass:   '🍀',
  yin:       '☯️',
  // Premium systems
  moon:      '🌔',
  tree:      '🧞‍♂️',
  spiral:    '🕉️',
  lotus:     '🪷',
  butterfly: '🧿',
  // Status flow
  heart:     '💝',
  lock:      '🪬',
  // Extra features
  pin:       '👑',
  radar:     '🧿',
  lightning: '❤️‍🔥',
  refresh:   '💋',
  // Quiz CTA
  sparkle:   '🌟',
};

export function Ico({ k, s = 22 }: { k: string; s?: number }) {
  const em = EM[k];
  return em
    ? <span style={{ fontSize: s, lineHeight: 1, display: 'inline-flex', userSelect: 'none' }}>{em}</span>
    : null;
}
