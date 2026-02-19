"use client";
import { Star, Moon, Flame, Wind, Sun, Shell, Atom, BookOpen, Hexagon, Triangle, Brain, Heart, MessageCircle, Eye, Compass, Network } from "lucide-react";

const spiritual = [
  { icon: Sun, name: "Western Astrology", desc: "Sun, Moon, Rising · full natal chart", tier: "Free" },
  { icon: Moon, name: "Vedic Astrology", desc: "Moon nakshatra · Jyotish placements", tier: "Premium" },
  { icon: Shell, name: "Mayan Tzolk'in", desc: "Day sign + tone from birth date", tier: "Premium" },
  { icon: Atom, name: "Human Design", desc: "Type, authority, profile, centers", tier: "Free" },
  { icon: Hexagon, name: "Gene Keys", desc: "4 personal keys: life work, evolution, radiance, purpose", tier: "Premium" },
  { icon: Flame, name: "Numerology", desc: "Life path, expression, soul urge", tier: "Free" },
  { icon: Triangle, name: "Tarot", desc: "Birth card + shadow card archetypes", tier: "Free" },
  { icon: Wind, name: "Chakra System", desc: "Energy center focus from birth data", tier: "Premium" },
  { icon: BookOpen, name: "I Ching", desc: "64 hexagrams mapped to personality", tier: "Free" },
  { icon: Star, name: "Element & Polarity", desc: "Fire / Earth / Air / Water balance", tier: "Free" },
];

const behavioral = [
  { icon: Brain, name: "Attachment Style", desc: "Secure, anxious, avoidant, disorganized", tier: "Free" },
  { icon: Heart, name: "Love Language", desc: "Acts, words, touch, time, gifts", tier: "Free" },
  { icon: MessageCircle, name: "Communication Style", desc: "Direct, expressive, reflective, analytical", tier: "Free" },
  { icon: Eye, name: "Core Values", desc: "Ranked priority matrix across 24 values", tier: "Free" },
  { icon: Compass, name: "Life Vision", desc: "Family, career, adventure, spiritual alignment", tier: "Free" },
  { icon: Network, name: "Conflict Resolution", desc: "How you handle disagreement under stress", tier: "Free" },
];

function Badge({ tier }: { tier: string }) {
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${
        tier === "Premium"
          ? "bg-amber-500/15 text-amber-300 border border-amber-500/20"
          : "bg-purple-500/10 text-purple-400 border border-purple-500/15"
      }`}
    >
      {tier}
    </span>
  );
}

export default function Systems() {
  return (
    <section id="systems" className="relative z-10 py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">The foundation</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">
            16 systems.{" "}
            <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">One truth.</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-xl mx-auto">
            Two data sources cross-referenced. Stars show who you are at birth. Behavior shows who you&apos;ve become.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Spiritual panel */}
          <div className="rounded-2xl overflow-hidden bg-purple-950/30 border border-purple-500/20">
            <div className="px-8 pt-8 pb-4 border-b border-purple-500/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-purple-300" />
                </div>
                <h3 className="text-base font-bold text-white">From the Stars</h3>
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/25">10 systems</span>
              </div>
              <p className="text-xs mt-1 text-purple-300/50">Calculated from birth date, time &amp; location</p>
            </div>
            <div>
              {spiritual.map(({ icon: Icon, name, desc, tier }) => (
                <div key={name} className="flex items-center gap-3 px-8 py-3.5 border-b border-purple-500/[0.08] hover:bg-purple-500/5 transition-colors">
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-purple-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-[11px] text-white/35 truncate">{desc}</div>
                  </div>
                  <Badge tier={tier} />
                </div>
              ))}
            </div>
          </div>

          {/* Behavioral panel */}
          <div className="rounded-2xl overflow-hidden bg-indigo-950/30 border border-indigo-500/20 flex flex-col">
            <div className="px-8 pt-8 pb-4 border-b border-indigo-500/10">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Heart className="w-3.5 h-3.5 text-indigo-300" />
                </div>
                <h3 className="text-base font-bold text-white">From Your Heart</h3>
                <span className="ml-auto text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">6 systems</span>
              </div>
              <p className="text-xs mt-1 text-indigo-300/50">Filled in via short questionnaires</p>
            </div>
            <div className="flex-1">
              {behavioral.map(({ icon: Icon, name, desc, tier }) => (
                <div key={name} className="flex items-center gap-3 px-8 py-3.5 border-b border-indigo-500/[0.08] hover:bg-indigo-500/5 transition-colors">
                  <div className="shrink-0 w-7 h-7 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                    <Icon className="w-3 h-3 text-indigo-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-white">{name}</div>
                    <div className="text-[11px] text-white/35 truncate">{desc}</div>
                  </div>
                  <Badge tier={tier} />
                </div>
              ))}
            </div>
            <div className="px-8 py-5 border-t border-indigo-500/10">
              <p className="text-[11px] text-white/25">Behavioral data never expires — re-take any questionnaire as you grow.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
