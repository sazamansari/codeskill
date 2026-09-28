"use client";

import Link from "next/link";
import { ArrowRight, Terminal, Sparkles, ShieldCheck } from "lucide-react";
import { HeroCodePreview } from "@/components/landing/HeroCodePreview";

export function Hero() {
  return (
    <section className="relative w-full pt-32 sm:pt-36 md:pt-40 pb-20 sm:pb-24 px-4 sm:px-6 md:px-8 border-b border-border overflow-hidden bg-background text-foreground">
      {/* Background radial depth & fine grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(197,20,46,0.06),transparent)] dark:bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(200,16,46,0.12),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:48px_48px] opacity-15 dark:opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Structured Messaging */}
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-5">
            
            {/* Small Label Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md border border-border bg-muted/40 text-[11px] font-medium text-muted-foreground shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Algorithmic Assessment &amp; Skill System</span>
            </div>

            {/* Controlled Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] text-foreground">
              Build stronger coding skills.
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
              Practice data structures and algorithms, take proctored assessments, and prepare for technical interviews.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
              <Link
                href="/problems"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm transition-all shadow-xs group"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/assessments"
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-card hover:bg-muted text-foreground font-medium text-sm border border-border transition-all shadow-xs"
              >
                <span>View Assessments</span>
              </Link>
            </div>

            {/* Platform Note */}
            <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Proctored execution environment with instant evaluation</span>
            </div>

          </div>

          {/* Right Column: Interactive Code Environment */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <HeroCodePreview />
          </div>

        </div>
      </div>
    </section>
  );
}
