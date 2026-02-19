"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Flame, Heart, MapPin, Moon, Scale, Star, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { value: "16", label: "Spiritual & behavioral systems" },
  { value: "93%", label: "Profile confidence after onboarding" },
  { value: "7 days", label: "One match — full attention" },
  { value: "Free", label: "Full oracle — no match required" },
];

const PROFILES = [
  {
    name: "Luna",
    age: 27,
    location: "San Francisco",
    score: 94,
    sign: "♓",
    label: "Twin Flame",
    icon: Flame,
    systems: ["Western Astro", "Life Path 7", "Gate 46"],
    gradient: "from-violet-600 via-purple-500 to-indigo-600",
    accent: "#a855f7",
  },
  {
    name: "Aria",
    age: 25,
    location: "New York",
    score: 87,
    sign: "♊",
    label: "Soul Companion",
    icon: Moon,
    systems: ["Human Design", "Numerology", "Mayan ✦"],
    gradient: "from-pink-500 via-rose-500 to-fuchsia-600",
    accent: "#ec4899",
  },
  {
    name: "Sage",
    age: 29,
    location: "Austin",
    score: 81,
    sign: "♒",
    label: "Karmic Bond",
    icon: Scale,
    systems: ["Vedic Moon", "Gene Key 5", "Tarot ✦"],
    gradient: "from-cyan-500 via-teal-400 to-emerald-500",
    accent: "#06b6d4",
  },
];

type Profile = (typeof PROFILES)[number];

function SwipeCard({
  profile,
  index,
  total,
  epoch,
  onSwipeAway,
}: {
  profile: Profile;
  index: number;
  total: number;
  epoch: number;
  onSwipeAway: () => void;
}) {
  const isTop = index === 0;
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-160, 160], [-18, 18]);
  const cardOpacity = useTransform(x, [-160, -90, 0, 90, 160], [0, 1, 1, 1, 0]);
  const likeOpacity = useTransform(x, [10, 70], [0, 1]);
  const nopeOpacity = useTransform(x, [-70, -10], [1, 0]);

  const scaleVal = index === 0 ? 1 : index === 1 ? 0.94 : 0.88;
  const yVal = index === 0 ? 0 : index === 1 ? 12 : 24;

  // Auto-swipe for the top card
  const hasSwiped = useRef(false);
  useEffect(() => {
    if (!isTop) return;
    hasSwiped.current = false;
    const timer = setTimeout(async () => {
      if (hasSwiped.current) return;
      hasSwiped.current = true;
      // animate right
      await x.animation?.stop();
      const target = 220;
      let start: number | null = null;
      const duration = 550;
      const startVal = x.get();
      function step(ts: number) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        const eased = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        x.set(startVal + (target - startVal) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else onSwipeAway();
      }
      requestAnimationFrame(step);
    }, 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTop, epoch]);

  const MatchIcon = profile.icon;

  return (
    <motion.div
      key={`${profile.name}-${epoch}`}
      style={
        isTop
          ? { x, rotate, opacity: cardOpacity, zIndex: total - index }
          : { zIndex: total - index }
      }
      animate={{ scale: scaleVal, y: yVal }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      onDragEnd={(_, info) => {
        if (Math.abs(info.offset.x) > 70) {
          hasSwiped.current = true;
          onSwipeAway();
        }
      }}
      className="absolute inset-x-0 top-0 h-full cursor-grab active:cursor-grabbing select-none"
    >
      {/* LIKE / NOPE stamps */}
      {isTop && (
        <>
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-4 left-3 z-20 rotate-[-22deg] border-[3px] border-green-400 text-green-400 font-black text-[13px] px-2 py-0.5 rounded-lg leading-none pointer-events-none"
          >
            LIKE
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-4 right-3 z-20 rotate-[22deg] border-[3px] border-red-400 text-red-400 font-black text-[13px] px-2 py-0.5 rounded-lg leading-none pointer-events-none"
          >
            NOPE
          </motion.div>
        </>
      )}

      {/* Card body */}
      <div
        className={`w-full h-full rounded-[24px] overflow-hidden bg-gradient-to-br ${profile.gradient} flex flex-col shadow-2xl`}
      >
        {/* Avatar area */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 relative px-4 pt-4">
          {/* Glowing ring */}
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center shadow-2xl"
            style={{ boxShadow: `0 0 32px ${profile.accent}80`, background: "rgba(0,0,0,0.25)" }}
          >
            <span className="text-5xl leading-none">{profile.sign}</span>
          </div>
          {/* Match label */}
          <div className="flex items-center gap-1 bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
            <MatchIcon className="w-2.5 h-2.5 text-yellow-300" />
            <span className="text-[10px] text-yellow-200 font-semibold">{profile.label}</span>
          </div>
          {/* Score badge */}
          <div
            className="absolute top-3 right-3 flex items-center gap-1 rounded-2xl px-2.5 py-1 bg-black/40 backdrop-blur-sm"
          >
            <Star className="w-2.5 h-2.5 text-yellow-400" fill="#facc15" />
            <span className="text-white font-black text-xs">{profile.score}%</span>
          </div>
        </div>

        {/* Info strip */}
        <div className="p-3.5 bg-black/35 backdrop-blur-md">
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="text-white font-bold text-sm leading-none">
                {profile.name}, {profile.age}
              </p>
              <div className="flex items-center gap-1 mt-1 text-white/55 text-[9px]">
                <MapPin className="w-2 h-2" />
                {profile.location}
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {profile.systems.map((s) => (
              <span
                key={s}
                className="text-[8.5px] bg-white/15 text-white/85 px-1.5 py-0.5 rounded-full font-medium"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function PhoneMockup() {
  const [stack, setStack] = useState(PROFILES);
  const [epoch, setEpoch] = useState(0);

  const handleSwipeAway = () => {
    setStack((prev) => {
      const next = prev.slice(1);
      if (next.length === 0) {
        // reset after a brief pause — epoch change forces key remount
        setTimeout(() => {
          setStack(PROFILES);
          setEpoch((e) => e + 1);
        }, 700);
      }
      return next;
    });
  };

  return (
    <div className="hidden lg:block absolute right-[max(0px,calc(50%-700px))] top-10 select-none">
      {/* Outer glow */}
      <div className="absolute inset-4 blur-3xl opacity-25 bg-gradient-to-b from-purple-500 to-indigo-600 rounded-full -z-10" />

      {/* Phone shell */}
      <div className="relative w-[230px] h-[490px] rounded-[46px] bg-[#09090f] border border-white/[0.12] shadow-[0_32px_80px_-12px_rgba(139,92,246,0.45)] overflow-hidden">
        {/* Dynamic island / notch */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[70px] h-[18px] bg-black rounded-full z-50 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/10" />
        </div>

        {/* Status bar */}
        <div className="absolute top-1.5 left-0 right-0 px-5 flex items-center justify-between z-40 pointer-events-none">
          <span className="text-[8px] text-white/40 font-semibold">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px] items-end h-2.5">
              {[3, 5, 7, 9].map((h, i) => (
                <div key={i} style={{ height: h }} className="w-[2px] bg-white/40 rounded-[1px]" />
              ))}
            </div>
            <div className="w-5 h-2.5 rounded-[3px] border border-white/30 relative ml-0.5">
              <div className="absolute inset-[2px] right-[4px] bg-white/50 rounded-[1px]" />
              <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-[5px] bg-white/30 rounded-r-[1px]" />
            </div>
          </div>
        </div>

        {/* App header */}
        <div className="pt-9 px-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Star className="w-2.5 h-2.5 text-white" fill="white" />
            </div>
            <span className="text-[11px] text-white font-bold tracking-tight">SoulMates</span>
          </div>
          <div className="flex items-center gap-1 text-[8.5px] text-purple-300 font-semibold bg-purple-500/20 border border-purple-500/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />3 nearby
          </div>
        </div>

        {/* Card stack */}
        <div className="relative mx-3 h-[300px]">
          {stack.length > 0 ? (
            stack.map((profile, i) => (
              <SwipeCard
                key={`${profile.name}-${epoch}`}
                profile={profile}
                index={i}
                total={stack.length}
                epoch={epoch}
                onSwipeAway={handleSwipeAway}
              />
            ))
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white/25 text-[11px]">Finding more matches…</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="absolute bottom-11 left-0 right-0 flex items-center justify-center gap-4">
          <button className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center shadow-lg">
            <X className="w-4 h-4 text-red-400" />
          </button>
          <button className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-900/60">
            <Star className="w-5 h-5 text-white" fill="white" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.09] flex items-center justify-center shadow-lg">
            <Heart className="w-4 h-4 text-pink-400" fill="#f472b6" />
          </button>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-14 h-[3px] bg-white/20 rounded-full" />
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative z-10 pt-36 pb-24 overflow-hidden">
      <PhoneMockup />

      {/* Centered content */}
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-8">
          <Star className="w-3 h-3" />
          Oracle-first dating — not just another swipe app
        </div>
        <h1 className="text-5xl lg:text-7xl font-black leading-tight text-white mb-6">
          Find Your{" "}
          <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            Cosmic Match
          </span>
        </h1>
        <p className="text-lg text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
          Enter your birth date and get a real soulmate reading from 16 spiritual and behavioral
          systems — no account needed. Matches appear when they&apos;re ready.
        </p>
        <div className="flex flex-wrap gap-4 justify-center mb-20">
          <a
            href="#download"
            className="flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-xl shadow-purple-900/40"
          >
            Get Your Free Reading
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#how"
            className="px-7 py-3.5 rounded-full font-semibold text-white/80 border border-white/10 hover:border-white/30 hover:text-white transition-all"
          >
            See How It Works
          </a>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                {s.value}
              </div>
              <div className="text-xs text-white/40 mt-0.5 leading-tight">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


