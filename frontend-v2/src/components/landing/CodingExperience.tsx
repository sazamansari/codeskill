"use client";

import React, { useState } from "react";
import { CheckCircle2, Play, Code2, Sparkles, Terminal } from "lucide-react";
import { motion } from "framer-motion";

const CODE_SNIPPETS: Record<string, string> = {
  "C++17": `vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> numMap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (numMap.count(complement)) return {numMap[complement], i};
        numMap[nums[i]] = i;
    }
    return {};
}`,
  "Python 3.12": `def twoSum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
  "Java 17": `public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) return new int[] { map.get(complement), i };
        map.put(nums[i], i);
    }
    return new int[0];
}`,
  "TypeScript": `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement)!, i];
        map.set(nums[i], i);
    }
    return [];
}`,
};

export function CodingExperience() {
  const [lang, setLang] = useState("C++17");
  const [isRunning, setIsRunning] = useState(false);

  const triggerRun = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 600);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 md:px-8 border-b border-border/70 bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Simple Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <Code2 className="w-3.5 h-3.5" />
            <span>Online Judge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Code. Run. Improve.
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Write code, run test cases instantly, and benchmark runtime efficiency.
          </p>
        </div>

        {/* Minimalist Editor Card */}
        <div className="rounded-xl bg-card border border-border shadow-xs overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-b border-border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Two Sum</span>
              <span className="text-muted-foreground text-[11px]">• Easy</span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              {Object.keys(CODE_SNIPPETS).map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    lang === item
                      ? "bg-amber-400 text-slate-950 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Code Snippet */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-[12.5px] leading-relaxed bg-background/50 overflow-x-auto">
            <pre className="text-foreground">
              <code>{CODE_SNIPPETS[lang]}</code>
            </pre>
          </div>

          {/* Clean Bottom Status Bar */}
          <div className="px-4 py-3 bg-muted/30 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
              </span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">12/12 Test Cases Passed</span>
              <span className="text-border">|</span>
              <span className="text-muted-foreground">Runtime: <strong className="text-foreground">38ms</strong></span>
            </div>

            <button
              onClick={triggerRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className={`w-3 h-3 fill-current ${isRunning ? "animate-spin" : ""}`} />
              <span>{isRunning ? "Running..." : "Run Solution"}</span>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
