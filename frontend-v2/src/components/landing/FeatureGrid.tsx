"use client";

import { FileCheck, Code2, LineChart, Trophy, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function FeatureGrid() {
  const features = [
    {
      num: "01",
      icon: FileCheck,
      title: "Coding Assessments",
      description: "Practice structured programming assessments with real-time automated evaluation, test cases, and time limits.",
      link: "/assessments",
      linkText: "View Assessments",
    },
    {
      num: "02",
      icon: Code2,
      title: "Algorithm Practice",
      description: "Master data structures and algorithms through targeted problems categorized by difficulty, topic, and patterns.",
      link: "/problems",
      linkText: "Browse Problems",
    },
    {
      num: "03",
      icon: LineChart,
      title: "Performance Tracking",
      description: "Track scores, submission histories, benchmark percentiles, and technical improvement over time with rich analytics.",
      link: "/dashboard",
      linkText: "View Dashboard",
    },
    {
      num: "04",
      icon: Trophy,
      title: "Leaderboards",
      description: "Compare performance with peers across university batches and maintain healthy competitive motivation.",
      link: "/leaderboard",
      linkText: "Check Standings",
    },
  ];

  return (
    <section className="w-full py-16 sm:py-20 px-4 sm:px-6 md:px-8 border-b border-border bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-muted text-muted-foreground border border-border text-[11px] font-medium uppercase tracking-wider">
            Evaluation &amp; Practice
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            Everything you need to prepare
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A focused environment built for problem solving, proctored examinations, and algorithmic mastery.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-5 rounded-lg bg-card border border-border hover:border-border/80 hover:shadow-sm transition-all duration-150"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-medium text-muted-foreground/70 px-1.5 py-0.5 rounded bg-muted border border-border/40">
                      {feature.num}
                    </span>
                    <div className="w-8 h-8 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-border/50">
                  <Link
                    href={feature.link}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <span>{feature.linkText}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
