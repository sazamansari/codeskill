"use client";

import { Shield, Cpu, Award, GraduationCap } from "lucide-react";

export function TrustBar() {
  const trustPillars = [
    {
      icon: GraduationCap,
      title: "Chandigarh University",
      subtitle: "Official Academic Platform",
    },
    {
      icon: Cpu,
      title: "Algorithmic Assessment",
      subtitle: "Automated Sandbox Evaluator",
    },
    {
      icon: Shield,
      title: "Proctored Examinations",
      subtitle: "Multi-factor Integrity Checks",
    },
    {
      icon: Award,
      title: "Interview Preparation",
      subtitle: "Industry-standard DSA Benchmarks",
    },
  ];

  return (
    <section className="w-full bg-card/40 border-b border-border py-6 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="shrink-0">
            <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
              Trusted Learning &amp; Assessment Infrastructure
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full lg:w-auto">
            {trustPillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-background/60 border border-border/60 hover:border-border transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{item.subtitle}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
