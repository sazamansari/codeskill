"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles, Terminal } from "lucide-react";
import { HeroCodePreview } from "@/components/landing/HeroCodePreview";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative w-full pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 px-4 sm:px-6 md:px-8 border-b border-border/70 overflow-hidden bg-background text-foreground">
      {/* Background architectural fine grid & subtle warmth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(250,204,21,0.08),transparent)] dark:bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(250,204,21,0.05),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.12] dark:opacity-[0.2] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Structured Typography & Conversion CTAs */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">

            {/* Small Label Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-xs font-semibold text-amber-600 dark:text-amber-400 shadow-xs"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>Algorithmic Assessment &amp; Skill System</span>
            </motion.div>

            {/* Primary Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight leading-[1.12] text-foreground"
            >
              Build Stronger <br className="hidden sm:inline" />
              <span className="text-foreground relative inline-block">
                Coding Skills.
                <span className="absolute bottom-1 left-0 right-0 h-2 bg-amber-400/30 -z-10 rounded-sm" />
              </span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg"
            >
              Practice data structures and algorithms, take proctored assessments, and prepare for technical interviews.
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-1"
            >
              <Link
                href="/problems"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-sm hover:shadow-md hover:scale-[1.02] group active:scale-[0.98]"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/assessments"
                className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-card hover:bg-muted text-foreground font-semibold text-sm border border-border transition-all shadow-xs hover:border-amber-400/40"
              >
                <span>View Assessments</span>
              </Link>
            </motion.div>

            {/* Product Capability Note */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 pt-2 text-xs text-muted-foreground"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Proctored execution environment with instant evaluation</span>
            </motion.div>

          </div>

          {/* Right Column: CodeSkill IDE Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center w-full"
          >
            <HeroCodePreview />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
