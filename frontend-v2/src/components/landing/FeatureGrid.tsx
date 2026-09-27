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
    <section className="w-full py-20 sm:py-24 px-4 sm:px-6 md:px-8 border-b border-border bg-background text-foreground">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold uppercase tracking-wider">
            Curriculum &amp; Examination Engine
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Everything You Need to Become Interview Ready
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            A unified engineering platform engineered for focused problem solving, proctored university evaluations, and algorithmic skill mastery.
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border hover:border-border/80 hover:shadow-lg transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-mono font-bold text-muted-foreground/60 px-2 py-0.5 rounded-md bg-muted/60 border border-border/40">
                      {feature.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-border/60">
                  <Link
                    href={feature.link}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group-hover:translate-x-0.5 transition-transform"
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
