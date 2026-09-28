"use client";

import { CheckSquare, Code2, LineChart, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      step: "01",
      icon: CheckSquare,
      title: "Choose an Assessment",
      description: "Select your scheduled semester exam, timed evaluation, or topic-specific DSA practice track.",
    },
    {
      step: "02",
      icon: Code2,
      title: "Solve Real Problems",
      description: "Code in a sandboxed IDE with automated compiler test cases, execution metrics, and proctored security.",
    },
    {
      step: "03",
      icon: LineChart,
      title: "Track Your Progress",
      description: "Review detailed test case pass rates, runtime percentiles, and university leaderboard standings.",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-border bg-card/20 text-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border text-[11px] font-medium uppercase tracking-wider">
            Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            How CodeSkill works
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A straightforward process to solve problems, submit code, and measure your technical progress.
          </p>
        </div>

        {/* 3 Steps Timeline (Horizontal on desktop, vertical on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-9 left-[15%] right-[15%] h-[1px] bg-border -z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center p-5 rounded-lg bg-card border border-border shadow-xs space-y-3 hover:border-border/80 transition-all"
              >
                {/* Step Circle Badge */}
                <div className="relative">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 rounded bg-muted text-foreground border border-border text-[9px] font-mono font-medium">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
