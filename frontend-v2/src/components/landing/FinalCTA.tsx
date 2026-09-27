"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 md:px-8 bg-background text-foreground relative overflow-hidden">
      {/* Subtle radial ambient light */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(200,16,46,0.06),transparent)] pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 p-8 sm:p-12 rounded-3xl bg-card border border-border shadow-xl">
        
        {/* Brand pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
          <GraduationCap className="w-4 h-4" />
          <span>CodeSkill Standardized Assessment &amp; Examination Platform</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Ready to Improve Your Coding Skills?
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Practice consistently. Measure your progress. Prepare for high-stakes university evaluations and technical interviews.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/problems"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold text-sm transition-all shadow-md group"
          >
            <span>Start Coding</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/assessments"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-card hover:bg-muted/60 text-foreground font-semibold text-sm border border-border transition-all shadow-xs"
          >
            <span>Take Assessment</span>
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-sm transition-all"
          >
            <span>Student Sign In</span>
          </Link>
        </div>

        {/* Footer meta */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground border-t border-border/60">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Proctoring Verified
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary" /> Instant Code Compilation
          </span>
          <span>500+ Curated Problems</span>
        </div>

      </div>
    </section>
  );
}
