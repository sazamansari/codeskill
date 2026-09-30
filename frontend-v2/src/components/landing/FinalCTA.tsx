"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Code2, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="relative w-full py-20 px-4 sm:px-6 md:px-8 border-b border-border/70 overflow-hidden bg-background text-foreground">
      {/* Background warm radial accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_120%,rgba(250,204,21,0.08),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Your Algorithmic Journey</span>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Start building better coding skills today.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Practice. Assess. Improve. Get ready for your next technical challenge.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/problems"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] group"
          >
            <span>Start Coding</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/assessments"
            className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-card hover:bg-muted text-foreground font-semibold text-sm border border-border shadow-xs hover:border-amber-400/40 transition-all"
          >
            <span>Explore Assessments</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Anti-Cheating Verified</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Multi-Language Sandboxes</span>
          </span>
          <span>•</span>
          <span>Instant Performance Diagnostics</span>
        </div>

      </div>
    </section>
  );
}
