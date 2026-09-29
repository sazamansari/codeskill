"use client";

import InteractiveListPreview from "@/components/ui/interactive-list-preview";
import { Sparkles, Terminal } from "lucide-react";

const PLATFORM_MODULES = [
  {
    client: "ALGORITHMIC CORE",
    platform: "DSA & CODING",
    services: "Dynamic Programming, Graph Theory, Trees, Bit Manipulation",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "AI PROCTORING",
    platform: "SECURE ENGINE",
    services: "Continuous Face Verification, Tab Switching Shield, Live Proctor Alerts",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "ISOLATED SANDBOX",
    platform: "MULTI-LANGUAGE RUNTIME",
    services: "Dockerized Kernel, Millisecond Execution, Memory & CPU Quotas",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "SKILL MATRIX",
    platform: "CU DEPT SKILL LAB",
    services: "Batch Diagnostics, Student Scorecards, Realtime ELO Ratings",
    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "CAMPUS HACK ARENA",
    platform: "LIVE CONTESTS",
    services: "Inter-department Battles, Anti-Plagiarism Heuristics, Global Standings",
    img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "VERIFIED CREDENTIALS",
    platform: "INSTITUTIONAL CERT",
    services: "Cryptographic Badging, Placement Readiness Score, PDF Transcripts",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
  },
];

export function InteractiveListSection() {
  return (
    <section className="relative w-full py-24 bg-neutral-950 border-t border-b border-border/40 overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Assessment Matrix</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-white">
            Engineered For High-Stakes Evaluation
          </h2>

          <p className="text-sm sm:text-base font-mono text-muted-foreground max-w-2xl mx-auto">
            Hover over any technical module to inspect the underlying architecture, execution sandbox, and proctoring systems.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-neutral-900/80 backdrop-blur-md shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[11px] font-mono text-white/40 ml-2">codeskill-engine://modules/preview</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/50">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span>GSAP Motion Accelerated</span>
            </div>
          </div>

          <InteractiveListPreview items={PLATFORM_MODULES} bgColor="#121212" />
        </div>
      </div>
    </section>
  );
}
