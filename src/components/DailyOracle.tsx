"use client";
import { Sun, Moon, Star, Zap, Shell, Flame, Wind } from "lucide-react";

const cards = [
  { icon: Sun,   title: "Daily Horoscope",       desc: "Your Sun, Moon and Rising transits for today.",                       gradient: "from-amber-600/40 to-orange-700/30",   border: "border-amber-500/25",  free: true  },
  { icon: Star,  title: "Tarot of the Day",       desc: "One card pulled from your personal archetype deck.",                 gradient: "from-purple-600/40 to-indigo-700/30", border: "border-purple-500/25", free: true  },
  { icon: Zap,   title: "Numerology Pulse",       desc: "Today's personal day number and energy signature.",                 gradient: "from-blue-600/40 to-cyan-700/30",    border: "border-blue-500/25",   free: true  },
  { icon: Shell, title: "Mayan Day Sign",         desc: "Today's Tzolk'in energy and how it intersects your sign.",          gradient: "from-emerald-600/40 to-teal-700/30", border: "border-emerald-500/25",free: false },
  { icon: Wind,  title: "Chakra Focus",           desc: "Which energy center needs attention today, based on your profile.",  gradient: "from-pink-600/40 to-rose-700/30",    border: "border-pink-500/25",   free: false },
  { icon: Flame, title: "Gene Keys Transmission", desc: "One of your 4 personal Gene Keys in focus today.",                  gradient: "from-red-600/40 to-orange-700/30",   border: "border-red-500/25",    free: false },
  { icon: Moon,  title: "Vedic Nakshatra",        desc: "Moon's passage through your natal nakshatra system.",               gradient: "from-violet-600/40 to-purple-700/30",border: "border-violet-500/25", free: false },
];

export default function DailyOracle() {
  return (
    <section id="oracle" className="relative z-10 py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Every single day</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            Your personal oracle
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto text-sm">
            3 free systems always on. 4 premium channels unlock with a subscription. All real, all personalized.
          </p>
        </div>

        {/* Free row */}
        <div className="mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-purple-400/60">Always free</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {cards.filter(c => c.free).map(({ icon: Icon, title, desc, gradient, border }) => (
              <div key={title} className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-6`}>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-white/60 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
        {/* Premium row */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-3 text-amber-400/60">Premium channels</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.filter(c => !c.free).map(({ icon: Icon, title, desc, gradient, border }) => (
              <div key={title} className={`relative overflow-hidden rounded-2xl border ${border} bg-gradient-to-br ${gradient} p-6`}>
                <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/25">Premium</span>
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                  <Icon className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
                <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
