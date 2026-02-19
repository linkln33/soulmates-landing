"use client";
import { Cpu, Target, Sun, Bell, Shield, Layers, MapPin, EyeOff, Zap, Palette } from "lucide-react";

const chips = ["Swiss Ephemeris", "Real calculations", "Not AI portraits"];

const medCards = [
  { icon: Target, label: "One match. Seven days.", desc: "No swipe fatigue. One high-compatibility person at a time — full attention, real intent.", gradient: "from-indigo-900/60 to-purple-900/40", border: "border-indigo-500/20", iconBg: "bg-indigo-500/20", iconColor: "text-indigo-300" },
  { icon: Sun, label: "Daily Oracle — always on", desc: "7 personalized insights every day. Works with zero matches — the oracle has value from day one.", gradient: "from-amber-900/50 to-orange-900/30", border: "border-amber-500/20", iconBg: "bg-amber-500/20", iconColor: "text-amber-300" },
  { icon: Bell, label: "Reverse Match Engine", desc: "Passively monitors new sign-ups. The moment someone above your threshold joins, you're notified.", gradient: "from-purple-900/60 to-violet-900/40", border: "border-purple-500/20", iconBg: "bg-purple-500/20", iconColor: "text-purple-300" },
  { icon: Palette, label: "Aura Visualization", desc: "Your personality rendered as a unique aura — a visual signature of all 16 systems combined.", gradient: "from-pink-900/50 to-rose-900/30", border: "border-pink-500/20", iconBg: "bg-pink-500/20", iconColor: "text-pink-300" },
];

const smallCards = [
  { icon: Shield,  label: "Trust Score",      desc: "Verified profiles, real intent.",             iconColor: "text-emerald-300" },
  { icon: MapPin,  label: "GPS Check-in",     desc: "Physical proximity meets cosmic match.",       iconColor: "text-blue-300" },
  { icon: EyeOff,  label: "Incognito Mode",   desc: "Browse & read your oracle privately.",         iconColor: "text-gray-300" },
  { icon: Zap,     label: "Pre-Swipe Oracle", desc: "Compatibility note before you commit.",        iconColor: "text-red-300" },
  { icon: Layers,  label: "Profile Tiers",    desc: "Free → Seeker → Twin Flame depth.",            iconColor: "text-violet-300" },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">What makes it different</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            Built different,{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              by design
            </span>
          </h2>
        </div>

        {/* Hero card — full width */}
        <div className="relative overflow-hidden rounded-2xl p-8 mb-4 flex flex-col md:flex-row md:items-center gap-6 bg-gradient-to-br from-purple-900/60 to-indigo-900/40 border border-purple-500/25">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full pointer-events-none bg-purple-600/20 blur-3xl" />
          <div className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-500/25">
            <Cpu className="w-7 h-7 text-purple-300" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2">Real astronomical calculations</h3>
            <p className="text-white/55 text-sm leading-relaxed">
              Birth charts, Vedic nakshatras, Mayan Tzolk&apos;in, Gene Keys, Human Design — computed from your exact birth data using Swiss Ephemeris. No AI portraits. No generic horoscopes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {chips.map((c) => (
              <span key={c} className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-300">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* 4 medium cards — 2 on sm, 4 on lg */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {medCards.map(({ icon: Icon, label, desc, gradient, border, iconBg, iconColor }) => (
            <div
              key={label}
              className={`relative overflow-hidden rounded-2xl p-6 flex flex-col gap-4 bg-gradient-to-br ${gradient} border ${border}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white mb-1.5">{label}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Small feature cards — 2 on mobile, 3 on sm, 5 on lg */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {smallCards.map(({ icon: Icon, label, desc, iconColor }) => (
            <div
              key={label}
              className="relative overflow-hidden rounded-2xl p-5 bg-white/[0.04] border border-white/[0.08] flex flex-col gap-3 hover:border-white/[0.14] transition-colors"
            >
              <Icon className={`w-4 h-4 ${iconColor}`} />
              <div>
                <h3 className="text-xs font-bold text-white mb-1">{label}</h3>
                <p className="text-white/40 text-[11px] leading-tight">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
