"use client";

import React, { useState } from "react";
import { Play, CheckCircle2, Terminal, Code2, Sparkles, Send, RefreshCw, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

const CODE_EXAMPLES: Record<string, string> = {
  "C++17": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> numMap;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (numMap.count(complement)) {
                return {numMap[complement], i};
            }
            numMap[nums[i]] = i;
        }
        return {};
    }
};`,
  "Python 3.12": `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`,
  "Java 17": `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  "TypeScript": `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement)!, i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
};

export function CodingExperience() {
  const [selectedLang, setSelectedLang] = useState("C++17");
  const [evaluating, setEvaluating] = useState(false);
  const [submitted, setSubmitted] = useState(true);

  const handleRun = () => {
    setEvaluating(true);
    setTimeout(() => {
      setEvaluating(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <section className="w-full py-20 px-4 sm:px-6 md:px-8 border-b border-border/70 bg-muted/20">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5" />
            <span>High-Performance Online Judge</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Code. Run. Improve.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Write solutions in an optimized web-based editor. Compile against comprehensive test suites in isolated sandbox containers with instant performance metrics.
          </p>
        </div>

        {/* IDE Mockup */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-card border border-border/80 shadow-xl overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/40 border-b border-border/70">
            <div className="flex items-center gap-3">
              <span className="font-bold text-sm text-foreground">Problem: Two Sum</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">•</span>
              <span className="text-xs text-muted-foreground font-mono hidden sm:inline">Difficulty: Easy</span>
            </div>

            {/* Language Selector Tabs */}
            <div className="flex items-center gap-1 bg-background p-1 rounded-lg border border-border/70">
              {Object.keys(CODE_EXAMPLES).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLang(lang)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    selectedLang === lang
                      ? "bg-amber-400 text-slate-950 shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Editor Body */}
          <div className="p-4 sm:p-6 font-mono text-xs sm:text-[13px] leading-relaxed bg-background overflow-x-auto min-h-[260px]">
            <pre className="text-foreground">
              <code>{CODE_EXAMPLES[selectedLang]}</code>
            </pre>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-muted/30 border-t border-border/70">
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Sandbox Ready: g++ (GCC) 13.2.0</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={evaluating}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-card hover:bg-muted text-foreground text-xs font-semibold border border-border shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 text-amber-500 ${evaluating ? "animate-spin" : ""}`} />
                <span>{evaluating ? "Running..." : "Run Code"}</span>
              </button>

              <button
                onClick={handleRun}
                disabled={evaluating}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5 fill-current" />
                <span>Submit Solution</span>
              </button>
            </div>
          </div>

          {/* Result Panel */}
          {submitted && (
            <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Accepted</span>
                </div>
                <span className="text-border">|</span>
                <span className="text-foreground font-semibold">12 / 12 Test Cases Passed</span>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">Runtime: <strong className="text-foreground">38 ms</strong> (faster than 94.2%)</span>
                <span className="text-border">|</span>
                <span className="text-muted-foreground">Memory: <strong className="text-foreground">19 MB</strong></span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                <span>Score: 100/100</span>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
