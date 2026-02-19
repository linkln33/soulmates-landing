"use client";
import { Sparkles } from "lucide-react";

const links = {
  Product: ["Features", "How it Works", "Daily Oracle", "Match Tiers", "Pricing"],
  Company: ["About", "Blog", "Press", "Careers"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="font-semibold text-white">Soulmates Quest</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Oracle-first dating. Real calculations. Intentional connections.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([col, items]) => (
            <div key={col}>
              <h4 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4">{col}</h4>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm text-white/40 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Soulmates Quest. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Built with love · Powered by Swiss Ephemeris
          </p>
        </div>
      </div>
    </footer>
  );
}
