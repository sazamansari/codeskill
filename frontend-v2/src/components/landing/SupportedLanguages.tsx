"use client";

import React from "react";
import { Terminal, Cpu, ShieldCheck, Zap } from "lucide-react";

interface LanguageSpec {
  name: string;
  tag: string;
  version: string;
  runtime: string;
  highlight: string;
  limits: string;
}

const LANGUAGES: LanguageSpec[] = [
  {
    name: "C++",
    tag: "cpp",
    version: "GCC 13.2",
    runtime: "C++17 & C++20",
    highlight: "High Performance",
    limits: "1.0s • 256 MB",
  },
  {
    name: "Java",
    tag: "java",
    version: "OpenJDK 17 / 21 LTS",
    runtime: "HotSpot VM",
    highlight: "Enterprise Standard",
    limits: "2.0s • 512 MB",
  },
  {
    name: "Python",
    tag: "python",
    version: "Python 3.12",
    runtime: "CPython Sandbox",
    highlight: "DSA & AI Ready",
    limits: "3.0s • 256 MB",
  },
  {
    name: "JavaScript",
    tag: "js",
    version: "Node.js 20 LTS",
    runtime: "V8 Engine",
    highlight: "Full Event Loop",
    limits: "2.0s • 256 MB",
  },
  {
    name: "TypeScript",
    tag: "ts",
    version: "TS 5.4",
    runtime: "Strict Typecheck",
    highlight: "Type Safe",
    limits: "2.0s • 256 MB",
  },
  {
    name: "C",
    tag: "c",
    version: "C11 / GCC 13",
    runtime: "Native Binary",
    highlight: "Systems Core",
    limits: "1.0s • 128 MB",
  },
];

export function SupportedLanguages() {
  return (
    <section className="w-full py-16 px-4 sm:px-6 md:px-8 border-b border-border bg-background text-foreground">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 border border-border text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
            <Terminal className="w-3.5 h-3.5 text-neutral-500" />
            <span>Polyglot Execution Engine</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            One platform. Multiple languages. Instant evaluation.
          </h2>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Every submission is executed within sub-millisecond isolated kernel sandboxes with enforced CPU, memory, and timeout constraints.
          </p>
        </div>

        {/* 6 Clean Technical Language Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {LANGUAGES.map((lang) => (
            <div
              key={lang.name}
              className="p-4 rounded-md bg-card border border-border hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-foreground border border-border">
                      .{lang.tag}
                    </span>
                    <h3 className="font-semibold text-sm text-foreground">
                      {lang.name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 border border-border px-1.5 py-0.5 rounded">
                    {lang.limits}
                  </span>
                </div>

                <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  {lang.version} • {lang.runtime}
                </div>
              </div>

              <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                  {lang.highlight}
                </span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Sandbox Ready
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guarantee Footnote */}
        <div className="p-3.5 rounded-md border border-border bg-neutral-50 dark:bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-neutral-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neutral-400" />
            <span>Dedicated cgroup v2 quotas for memory, pids, and CPU execution time</span>
          </div>
          <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-300">
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sub-millisecond Cold Starts</span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default SupportedLanguages;
