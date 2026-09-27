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
          <div className="lg:col-span-6 flex flex-col items-start text-left space-y-6">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-muted/50 text-xs font-semibold tracking-wider text-muted-foreground uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>CODE • PRACTICE • ASSESS • GROW</span>
            </div>

            {/* Controlled Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
              Build the Skills That{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-foreground">
                Companies Look For.
              </span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
              Practice coding, master algorithms, and prepare for technical interviews through real-world programming challenges.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2">
              <Link
                href="/problems"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 active:bg-primary/80 text-primary-foreground font-semibold text-sm transition-all shadow-md group"
              >
                <span>Start Coding</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/assessments"
                className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-card hover:bg-muted/60 text-foreground font-semibold text-sm border border-border transition-all shadow-xs"
              >
                <span>Explore Assessments</span>
              </Link>
            </div>

            {/* Trust / Institutional Note */}
            <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Built for Chandigarh University students &amp; faculty</span>
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
