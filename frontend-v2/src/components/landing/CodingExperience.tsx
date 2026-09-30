"use client";

import React, { useState } from "react";
import { CheckCircle2, Play, Code2 } from "lucide-react";

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
    setTimeout(() => setIsRunning(false), 500);
  };

  return (
    <section className="w-full py-16 px-4 sm:px-6 md:px-8 border-b border-border bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Simple Header */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Code. Run. Improve.
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Write code, run test cases instantly, and benchmark runtime efficiency.
          </p>
        </div>

        {/* Minimalist Editor Card */}
        <div className="rounded-md bg-card border border-border overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border-b border-border text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">Two Sum</span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Easy
              </span>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              {Object.keys(CODE_SNIPPETS).map((item) => (
                <button
                  key={item}
                  onClick={() => setLang(item)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                    lang === item
                      ? "bg-black text-white dark:bg-white dark:text-black font-semibold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Code Snippet */}
          <div className="p-4 sm:p-5 font-mono text-xs sm:text-[12.5px] leading-relaxed bg-neutral-950 text-neutral-100 overflow-x-auto">
            <pre>
              <code>{CODE_SNIPPETS[lang]}</code>
            </pre>
          </div>

          {/* Clean Bottom Status Bar */}
          <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-900/50 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-neutral-600 dark:text-neutral-400">12/12 Test Cases Passed</span>
              <span className="text-neutral-300 dark:text-neutral-700">|</span>
              <span className="text-neutral-600 dark:text-neutral-400">Runtime: <strong className="text-foreground">38ms</strong></span>
            </div>

            <button
              onClick={triggerRun}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
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

export default CodingExperience;
