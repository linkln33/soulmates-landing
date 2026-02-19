"use client";

const tiers = [
  { name: "Twin Flame",     range: "93%+",    bar: "from-purple-500 to-pink-500",   width: "100%", desc: "Rare. All 16 systems align. Notified immediately." },
  { name: "Soul Bond",      range: "85–92%",  bar: "from-indigo-500 to-purple-500", width: "90%",  desc: "Deep resonance across spiritual and behavioral layers." },
  { name: "Kindred Spirit", range: "75–84%",  bar: "from-blue-500 to-indigo-500",   width: "78%",  desc: "Strong compatibility — meaningful long-term potential." },
  { name: "Resonant Match", range: "65–74%",  bar: "from-cyan-500 to-blue-500",     width: "62%",  desc: "Genuine alignment in key systems. Worth exploring." },
  { name: "Compatible",     range: "55–64%",  bar: "from-teal-500 to-cyan-500",     width: "48%",  desc: "Solid foundation. Less cosmic fire, more steady ground." },
];

export default function MatchTiers() {
  return (
    <section className="relative z-10 py-32">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">Compatibility levels</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">Match tiers</h2>
          <p className="text-white/50 mt-4 text-sm">You set your minimum threshold. We only notify you when someone clears it.</p>
        </div>

        <div className="space-y-3">
          {tiers.map((t) => (
            <div key={t.name} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-6 hover:border-white/[0.10] transition-colors">
              <div className="w-32 shrink-0">
                <div className="text-sm font-bold text-white">{t.name}</div>
                <div className="text-xs text-white/40 mt-0.5">{t.range}</div>
              </div>
              <div className="flex-1">
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${t.bar}`} style={{ width: t.width }} />
                </div>
              </div>
              <p className="hidden md:block w-52 text-xs text-white/40 shrink-0">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

