"use client";

import { useState } from "react";
import InteractiveListPreview, { InteractiveListItem } from "@/components/ui/interactive-list-preview";
import { Sparkles, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PLATFORM_MODULES: InteractiveListItem[] = [
  {
    client: "ALGORITHMIC CORE",
    platform: "DSA & CODING",
    services: "DYNAMIC PROGRAMMING, GRAPH THEORY, TREES, BIT MANIPULATION",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "AI PROCTORING",
    platform: "SECURE ENGINE",
    services: "CONTINUOUS FACE VERIFICATION, TAB SWITCHING SHIELD, LIVE PROCTOR ALERTS",
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "ISOLATED SANDBOX",
    platform: "MULTI-LANGUAGE RUNTIME",
    services: "DOCKERIZED KERNEL, MILLISECOND EXECUTION, MEMORY & CPU QUOTAS",
    img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "SKILL MATRIX",
    platform: "CU DEPT SKILL LAB",
    services: "BATCH DIAGNOSTICS, STUDENT SCORECARDS, REALTIME ELO RATINGS",
    img: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "CAMPUS HACK ARENA",
    platform: "LIVE CONTESTS",
    services: "INTER-DEPARTMENT BATTLES, ANTI-PLAGIARISM HEURISTICS, GLOBAL STANDINGS",
    img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    client: "VERIFIED CREDENTIALS",
    platform: "INSTITUTIONAL CERT",
    services: "CRYPTOGRAPHIC BADGING, PLACEMENT READINESS SCORE, PDF TRANSCRIPTS",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
  },
];

export function InteractiveListSection() {
  const [activeItem, setActiveItem] = useState<InteractiveListItem | null>(null);

  return (
    <section className="relative w-full py-28 bg-background border-t border-b border-border/40 overflow-hidden text-white">
      
      {/* 1. Full Screen Background Colorful Radial Gradient Ambient Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Purple / Magenta Glow on Left */}
        <div className="absolute -top-10 -left-20 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.22)_0%,rgba(147,51,234,0.12)_40%,transparent_70%)] blur-3xl" />
        
        {/* Emerald / Green Glow on Right */}
        <div className="absolute top-10 -right-20 w-[650px] h-[650px] bg-[radial-gradient(circle,rgba(16,185,129,0.22)_0%,rgba(5,150,105,0.1)_40%,transparent_70%)] blur-3xl" />
        
        {/* Deep Teal / Cyan Ambient Glow Bottom Left */}
        <div className="absolute -bottom-20 left-1/4 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(6,182,212,0.15)_0%,transparent_70%)] blur-3xl" />
        
        {/* Pink / Rose Subtle Accent Bottom Right */}
        <div className="absolute bottom-0 right-10 w-[450px] h-[450px] bg-[radial-gradient(circle,rgba(236,72,153,0.12)_0%,transparent_70%)] blur-3xl" />
      </div>

      {/* 2. Dynamic Image Animation on the MAIN SCREEN BEHIND the container */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeItem && (
            <motion.div
              key={activeItem.client}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.28, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={activeItem.img}
                alt={activeItem.client}
                className="w-full h-full object-cover filter blur-xl mix-blend-screen"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Main Content Wrapper */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono tracking-wider uppercase">
            <span># INTERACTIVE ASSESSMENT MATRIX</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-white">
            Engineered For High-Stakes Evaluation
          </h2>

          <p className="text-sm sm:text-base font-mono text-neutral-400 max-w-2xl mx-auto">
            Hover over any technical module to inspect the underlying architecture, execution sandbox, and proctoring systems.
          </p>
        </div>

        {/* Center List / Terminal Container (Dark background for crisp readability) */}
        <div className="rounded-2xl border border-white/10 bg-[#0d0d0d]/90 backdrop-blur-xl shadow-2xl overflow-hidden transition-all">
          
          {/* Terminal Topbar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-white/50 ml-2">codeskill-engine://modules/preview</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-white/60">
              <Terminal className="w-3.5 h-3.5 text-neutral-400" />
              <span>GSAP Motion Accelerated</span>
            </div>
          </div>

          {/* Interactive Table (No inner image obscuring rows) */}
          <InteractiveListPreview
            items={PLATFORM_MODULES}
            bgColor="transparent"
            onHoverChange={(item) => setActiveItem(item)}
          />
        </div>

      </div>
    </section>
  );
}

export default InteractiveListSection;
