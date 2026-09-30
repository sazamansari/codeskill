"use client";

import React, { useState } from "react";
import { CheckCircle2, Play, Terminal, Code2, Sparkles, Copy, Check, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ModernLoader from "@/components/ui/modern-loader";

export function HeroCodePreview() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"solution" | "sandbox" | "cases">("solution");
  const [isExecuting, setIsExecuting] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(`function solve(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunExecution = () => {
    setIsExecuting(true);
    setActiveTab("sandbox");
    setTimeout(() => {
      setIsExecuting(false);
      setActiveTab("solution");
    }, 3200);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden text-xs font-mono transition-all">
      {/* Editor Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border/70 select-none">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="h-4 w-[1px] bg-border mx-0.5" />
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab("solution")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "solution"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-amber-500" />
              <span>TwoSum.ts</span>
            </button>
            <button
              onClick={() => setActiveTab("sandbox")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "sandbox"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sandbox Engine</span>
            </button>
            <button
              onClick={() => setActiveTab("cases")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === "cases"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>TestCases</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunExecution}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-3 h-3 fill-current ${isExecuting ? "animate-spin" : ""}`} />
            <span>{isExecuting ? "Evaluating..." : "Run"}</span>
          </button>
          <button
            onClick={copyCode}
            aria-label="Copy solution code"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <AnimatePresence mode="wait">
        {activeTab === "sandbox" ? (
          <motion.div
            key="sandbox-loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex items-center justify-center p-4 sm:p-6 bg-background/60 min-h-[290px]"
          >
            <ModernLoader
              words={[
                "Spinning up Docker sandbox...",
                "Running test case suite...",
                "Calculating time & memory limits...",
                "Finalizing evaluation...",
              ]}
              className="p-0 w-full max-w-none"
            />
          </motion.div>
        ) : activeTab === "solution" ? (
          <motion.div
            key="solution-split"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-border/60 bg-background/50"
          >
            {/* Left Problem Spec Sub-pane */}
            <div className="md:col-span-5 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-muted/10 font-sans text-xs">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground tracking-tight">1. Two Sum</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Easy
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Given an array of integers <code className="font-mono text-primary font-semibold">nums</code> and an integer <code className="font-mono text-primary font-semibold">target</code>, return indices of the two numbers such that they add up to target.
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-card border border-border/80 font-mono text-[10px] space-y-1">
                <div className="text-muted-foreground font-semibold">Example 1:</div>
                <div><span className="text-muted-foreground">Input:</span> nums = [2,7,11,15], target = 9</div>
                <div><span className="text-emerald-500 font-bold">Output:</span> [0,1]</div>
              </div>

              <div className="pt-2 flex items-center gap-1.5 text-[10px] text-muted-foreground border-t border-border/50">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Proctored Isolated Runtime</span>
              </div>
            </div>

            {/* Right Code Sub-pane */}
            <div className="md:col-span-7 p-4 sm:p-5 font-mono text-[11px] sm:text-[11.5px] leading-relaxed overflow-x-auto">
              <div className="table w-full">
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">1</span>
                  <span className="table-cell">
                    <span className="text-amber-500 font-semibold">function</span> <span className="text-blue-500 dark:text-blue-400 font-semibold">solve</span>
                    <span className="text-foreground">(nums: </span>
                    <span className="text-emerald-600 dark:text-emerald-400">number[]</span>
                    <span className="text-foreground">, target: </span>
                    <span className="text-emerald-600 dark:text-emerald-400">number</span>
                    <span className="text-foreground">): </span>
                    <span className="text-emerald-600 dark:text-emerald-400">number[]</span>
                    <span className="text-foreground"> {'{'}</span>
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">2</span>
                  <span className="table-cell pl-4">
                    <span className="text-amber-500 font-semibold">const</span> map = <span className="text-amber-500 font-semibold">new</span> <span className="text-primary font-semibold">Map</span>&lt;<span className="text-emerald-600 dark:text-emerald-400">number</span>, <span className="text-emerald-600 dark:text-emerald-400">number</span>&gt;();
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">3</span>
                  <span className="table-cell pl-4">
                    <span className="text-amber-500 font-semibold">for</span> (<span className="text-amber-500 font-semibold">let</span> i = <span className="text-rose-500">0</span>; i &lt; nums.length; i++) {'{'}
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">4</span>
                  <span className="table-cell pl-8">
                    <span className="text-amber-500 font-semibold">const</span> complement = target - nums[i];
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">5</span>
                  <span className="table-cell pl-8">
                    <span className="text-amber-500 font-semibold">if</span> (map.<span className="text-blue-500 dark:text-blue-400">has</span>(complement)) {'{'}
                  </span>
                </div>
                <div className="table-row bg-emerald-500/10 -mx-4 px-4 rounded">
                  <span className="table-cell pr-3 select-none text-right w-5 text-emerald-500 font-bold">6</span>
                  <span className="table-cell pl-12">
                    <span className="text-amber-500 font-semibold">return</span> [map.<span className="text-blue-500 dark:text-blue-400">get</span>(complement)!, i];
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">7</span>
                  <span className="table-cell pl-8">{'}'}</span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">8</span>
                  <span className="table-cell pl-8">
                    map.<span className="text-blue-500 dark:text-blue-400">set</span>(nums[i], i);
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">9</span>
                  <span className="table-cell pl-4">{'}'}</span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">10</span>
                  <span className="table-cell pl-4">
                    <span className="text-amber-500 font-semibold">return</span> [];
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-3 select-none text-right w-5 text-muted-foreground/40">11</span>
                  <span className="table-cell">{'}'}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cases-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-5 font-mono text-[11px] sm:text-xs leading-relaxed bg-background/50 space-y-2 min-h-[290px]"
          >
            <div className="text-muted-foreground">// Automated Sandbox Verification Pipeline</div>
            <div className="space-y-1.5 text-foreground pt-1">
              <p className="text-emerald-500 flex items-center gap-2"><span>✓</span> Test 1: [2, 7, 11, 15], target = 9 ➔ [0, 1] (Pass • 0.8ms)</p>
              <p className="text-emerald-500 flex items-center gap-2"><span>✓</span> Test 2: [3, 2, 4], target = 6 ➔ [1, 2] (Pass • 0.6ms)</p>
              <p className="text-emerald-500 flex items-center gap-2"><span>✓</span> Test 3: [3, 3], target = 6 ➔ [0, 1] (Pass • 0.5ms)</p>
              <p className="text-emerald-500 flex items-center gap-2"><span>✓</span> Test 4: Stress Case (100,000 items) ➔ Pass (42ms)</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Execution Results Footer Status Panel */}
      <div className="p-3.5 bg-muted/40 border-t border-border/80 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Accepted</span>
          </div>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">
            Runtime: <strong className="text-foreground">42 ms</strong>
          </span>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">
            Memory: <strong className="text-foreground">18.4 MB</strong>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold text-[10px] uppercase tracking-wider">
            12 / 12 Test Cases Passed
          </span>
        </div>
      </div>
    </div>
  );
}
