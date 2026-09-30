"use client";

import React from "react";
import { Code2, Terminal, CheckCircle2, Zap, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const LANGUAGES = [
  {
    name: "C++",
    version: "GCC 13.2 / C++17 & C++20",
    badge: "High Performance",
    icon: "⚡",
  },
  {
    name: "Java",
    version: "OpenJDK 17 / 21 LTS",
    badge: "Enterprise Standard",
    icon: "☕",
  },
  {
    name: "Python",
    version: "Python 3.12",
    badge: "DSA & AI Ready",
    icon: "🐍",
  },
  {
    name: "JavaScript",
    version: "Node.js 20 LTS",
    badge: "V8 Engine",
    icon: "🟨",
  },
  {
    name: "TypeScript",
    version: "TS 5.4 / Strict Mode",
    badge: "Type Safe",
    icon: "🔷",
  },
  {
    name: "C",
    version: "C11 / GCC 13",
    badge: "Systems Core",
    icon: "⚙️",
  },
];

export function SupportedLanguages() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 md:px-8 border-b border-border/70 bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>Polyglot Execution Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            One platform. Multiple languages. Instant evaluation.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Every submission is executed within sub-millisecond isolated kernel sandboxes with enforced CPU, memory, and timeout constraints.
          </p>
        </div>

        {/* Languages Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {LANGUAGES.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="p-4 rounded-xl bg-card border border-border/80 hover:border-amber-400/50 hover:shadow-xs transition-all flex flex-col items-center text-center space-y-2 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform select-none">
                {lang.icon}
              </span>
              <div>
                <h3 className="font-bold text-sm text-foreground">{lang.name}</h3>
                <span className="text-[10px] text-muted-foreground block font-mono">
                  {lang.version}
                </span>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                {lang.badge}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
