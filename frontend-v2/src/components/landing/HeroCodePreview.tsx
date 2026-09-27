"use client";

import React, { useState } from "react";
import { CheckCircle2, Play, Terminal, Code2, Sparkles, Copy, Check } from "lucide-react";

export function HeroCodePreview() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "tests">("code");

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

  return (
    <div className="relative w-full max-w-xl mx-auto rounded-2xl bg-card border border-border/80 shadow-2xl overflow-hidden text-xs font-mono transition-all duration-300">
      {/* Ambient glow behind preview */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Editor Window Titlebar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70 inline-block" />
          </div>
          <div className="h-4 w-[1px] bg-border mx-1" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("code")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "code"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-primary" />
              <span>solution.ts</span>
            </button>
            <button
              onClick={() => setActiveTab("tests")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors ${
                activeTab === "tests"
                  ? "bg-background text-foreground shadow-xs border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
              <span>test_cases.json</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3 h-3" /> TypeScript 5.4
          </span>
          <button
            onClick={copyCode}
            aria-label="Copy solution code"
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "code" ? (
        <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-x-auto bg-background/50">
          <div className="table w-full">
            <div className="table-row text-muted-foreground/60">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">1</span>
              <span className="table-cell text-muted-foreground italic select-none">// Problem: Two Sum (Optimal Hash Map)</span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">2</span>
              <span className="table-cell">
                <span className="text-primary font-semibold">function</span> <span className="text-blue-500 dark:text-blue-400 font-semibold">solve</span>
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
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">3</span>
              <span className="table-cell pl-4">
                <span className="text-primary font-semibold">const</span> map = <span className="text-primary font-semibold">new</span> <span className="text-amber-500 font-semibold">Map</span>&lt;<span className="text-emerald-600 dark:text-emerald-400">number</span>, <span className="text-emerald-600 dark:text-emerald-400">number</span>&gt;();
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">4</span>
              <span className="table-cell pl-4">
                <span className="text-primary font-semibold">for</span> (<span className="text-primary font-semibold">let</span> i = <span className="text-rose-500 dark:text-rose-400">0</span>; i &lt; nums.length; i++) {'{'}
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">5</span>
              <span className="table-cell pl-8">
                <span className="text-primary font-semibold">const</span> complement = target - nums[i];
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">6</span>
              <span className="table-cell pl-8">
                <span className="text-primary font-semibold">if</span> (map.<span className="text-blue-500 dark:text-blue-400">has</span>(complement)) {'{'}
              </span>
            </div>
            <div className="table-row bg-emerald-500/10 -mx-4 px-4 rounded">
              <span className="table-cell pr-3 select-none text-right w-6 text-emerald-500 font-mono">7</span>
              <span className="table-cell pl-12">
                <span className="text-primary font-semibold">return</span> [map.<span className="text-blue-500 dark:text-blue-400">get</span>(complement)!, i];
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">8</span>
              <span className="table-cell pl-8">{'}'}</span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">9</span>
              <span className="table-cell pl-8">
                map.<span className="text-blue-500 dark:text-blue-400">set</span>(nums[i], i);
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">10</span>
              <span className="table-cell pl-4">{'}'}</span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">11</span>
              <span className="table-cell pl-4">
                <span className="text-primary font-semibold">return</span> [];
              </span>
            </div>
            <div className="table-row">
              <span className="table-cell pr-3 select-none text-right w-6 text-muted-foreground/40 font-mono">12</span>
              <span className="table-cell">{'}'}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 sm:p-5 font-mono text-[11px] sm:text-xs leading-relaxed bg-background/50">
          <div className="text-muted-foreground">// Validated against 42 automated edge test cases</div>
          <div className="mt-2 space-y-1 text-foreground">
            <p className="text-emerald-500">✓ Test 1: [2, 7, 11, 15], target = 9 ➔ Expected: [0, 1]</p>
            <p className="text-emerald-500">✓ Test 2: [3, 2, 4], target = 6 ➔ Expected: [1, 2]</p>
            <p className="text-emerald-500">✓ Test 3: [3, 3], target = 6 ➔ Expected: [0, 1]</p>
            <p className="text-emerald-500">✓ Test 4: Large array (100k elements) ➔ Pass (18ms)</p>
          </div>
        </div>
      )}

      {/* Execution Results Footer Panel */}
      <div className="p-3.5 bg-muted/30 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>All 42 Test Cases Passed</span>
          </div>
          <span className="text-border">|</span>
          <span className="text-muted-foreground">Runtime: <strong className="text-foreground">42ms</strong> <span className="text-emerald-500 font-medium">(Beats 96.4%)</span></span>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold font-mono">
            Score: 94/100
          </span>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-semibold text-[10px] uppercase">
            Accepted
          </span>
        </div>
      </div>
    </div>
  );
}
