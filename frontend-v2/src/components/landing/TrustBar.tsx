"use client";

import React from "react";
import { ShieldCheck, Zap, Code2, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: "Secure Code Execution",
    desc: "Isolated Docker sandbox runtime",
  },
  {
    icon: Zap,
    title: "Instant Test Evaluation",
    desc: "Millisecond automated test runs",
  },
  {
    icon: Code2,
    title: "Multiple Languages",
    desc: "C++, Java, Python, JS, TS",
  },
  {
    icon: Clock,
    title: "Real-Time Submissions",
    desc: "Instant metrics, memory & runtime",
  },
  {
    icon: CheckCircle2,
    title: "Automated Scoring",
    desc: "Objective rubric & benchmark ELO",
  },
];

export function TrustBar() {
  return (
    <section className="w-full border-b border-border/70 bg-card/60 py-8 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Capability Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Proctored execution environment with instant evaluation
            </span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Enterprise Grade • Zero Setup Required
          </span>
        </div>

        {/* 5 Capability Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CAPABILITIES.map((cap, i) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-3.5 rounded-xl bg-background border border-border/80 hover:border-amber-400/40 hover:shadow-xs transition-all flex flex-col items-start gap-2 group"
              >
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-500 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs text-foreground tracking-tight">
                    {cap.title}
                  </div>
                  <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                    {cap.desc}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
