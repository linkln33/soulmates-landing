"use client";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section id="download" className="relative z-10 py-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <div className="relative rounded-3xl overflow-hidden border border-purple-500/25 bg-gradient-to-br from-purple-900/60 to-indigo-900/40 p-12 md:p-20 text-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[80px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
              Your reading starts with<br className="hidden sm:block" /> just a birth date.
            </h2>
            <p className="text-white/60 mb-10 max-w-md mx-auto text-lg">
              No credit card. No lengthy profile setup. See your cosmic blueprint in 30 seconds — for free, forever.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-2xl shadow-purple-900/50"
              >
                Get Your Free Reading
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-all"
              >
                Download the App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
