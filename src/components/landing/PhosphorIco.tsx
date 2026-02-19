'use client';
import { Icon, addCollection } from '@iconify/react/dist/offline';
// eslint-disable-next-line @typescript-eslint/no-require-imports
addCollection(require('@iconify-json/fluent-emoji-flat/icons.json'));

const EM: Record<string, string> = {
  sun:       'fluent-emoji-flat:glowing-star',
  user:      'fluent-emoji-flat:bullseye',
  bell:      'fluent-emoji-flat:bell',
  scales:    'fluent-emoji-flat:balance-scale',
  planet:    'fluent-emoji-flat:ringed-planet',
  hash:      'fluent-emoji-flat:input-numbers',
  cards:     'fluent-emoji-flat:magic-wand',
  fire:      'fluent-emoji-flat:fire',
  heart2:    'fluent-emoji-flat:sparkling-heart',
  link:      'fluent-emoji-flat:link',
  brain:     'fluent-emoji-flat:brain',
  compass:   'fluent-emoji-flat:compass',
  yin:       'fluent-emoji-flat:yin-yang',
  moon:      'fluent-emoji-flat:crescent-moon',
  tree:      'fluent-emoji-flat:dna',
  spiral:    'fluent-emoji-flat:spiral-shell',
  lotus:     'fluent-emoji-flat:lotus',
  butterfly: 'fluent-emoji-flat:butterfly',
  heart:     'fluent-emoji-flat:green-heart',
  lock:      'fluent-emoji-flat:locked-with-key',
  pin:       'fluent-emoji-flat:round-pushpin',
  radar:     'fluent-emoji-flat:satellite-antenna',
  lightning: 'fluent-emoji-flat:high-voltage',
  refresh:   'fluent-emoji-flat:counterclockwise-arrows-button',
  sparkle:   'fluent-emoji-flat:sparkles',
};

export function Ico({ k, s = 22 }: { k: string; s?: number }) {
  const name = EM[k];
  return name ? <Icon icon={name} width={s} height={s} /> : null;
}
