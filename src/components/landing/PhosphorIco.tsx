'use client';
import {
  SunHorizon, UserFocus, BellRinging, Scales,
  Planet, Hash, Cards, Fire, ChatTeardropText, LinkSimple,
  Brain, Compass, YinYang,
  MoonStars, TreeStructure, Spiral, FlowerLotus, Butterfly,
  HeartStraight, LockKey,
  MapPin, Broadcast, Lightning, ArrowsCounterClockwise, Sparkle,
} from '@phosphor-icons/react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const PHO: Record<string, any> = {
  sun: SunHorizon,   user: UserFocus,   bell: BellRinging,  scales: Scales,
  planet: Planet,    hash: Hash,        cards: Cards,       fire: Fire,
  heart2: ChatTeardropText, link: LinkSimple, brain: Brain, compass: Compass,
  yin: YinYang,      moon: MoonStars,   tree: TreeStructure, spiral: Spiral,
  lotus: FlowerLotus, butterfly: Butterfly,
  heart: HeartStraight, lock: LockKey,
  pin: MapPin, radar: Broadcast, lightning: Lightning,
  refresh: ArrowsCounterClockwise, sparkle: Sparkle,
};

export function Ico({ k, s = 18 }: { k: string; s?: number }) {
  const C = PHO[k];
  return C ? <C size={s} weight="duotone" /> : null;
}
