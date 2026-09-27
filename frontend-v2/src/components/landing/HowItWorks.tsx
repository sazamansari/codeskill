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
    <section className="w-full py-20 sm:py-24 px-4 sm:px-6 md:px-8 border-b border-border bg-card/20 text-foreground">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            Workflow &amp; Evaluation Pipeline
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            How CodeSkill Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A structured three-step methodology from fundamental problem solving to high-stakes interview readiness.
          </p>
        </div>

        {/* 3 Steps Timeline (Horizontal on desktop, vertical on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-border to-transparent -z-0" />

          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex flex-col items-center text-center p-6 rounded-2xl bg-card border border-border shadow-xs space-y-4 hover:border-border/80 transition-all"
              >
                {/* Step Circle Badge */}
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-md bg-muted text-foreground border border-border text-[10px] font-mono font-bold">
                    {item.step}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
