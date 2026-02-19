"use client";

const steps = [
  {
    num: "01",
    title: "Free Cosmic Reading",
    desc: "Enter your name and birth date. Get a partial soulmate profile drawn from 5 spiritual systems — no account needed. Takes 30 seconds.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    num: "02",
    title: "Join & Complete Your Profile",
    desc: "Sign up and answer 6 short behavioral questionnaires. Your profile confidence climbs from ~55% to ~93% and the app begins scanning for real matches.",
    gradient: "from-indigo-500 to-pink-500",
  },
  {
    num: "03",
    title: "One Match. Daily Guidance.",
    desc: "When someone above your threshold appears you get notified immediately. Meanwhile enjoy personalized daily oracle insights — yours whether or not a match exists.",
    gradient: "from-pink-500 to-purple-500",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative z-10 py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-20">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-4">The process</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white">How it works</h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.num}
              className="relative p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br ${s.gradient} text-white font-black text-base mb-6 shadow-lg`}>
                {s.num}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-white/50 leading-relaxed text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


