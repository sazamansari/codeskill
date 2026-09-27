"use client";

import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { AssessmentPreview } from "@/components/landing/AssessmentPreview";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full font-sans bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* 1. Controlled Two-Column Hero with Structured Code Environment */}
      <Hero />

      {/* 2. Compact University Credibility & Trust Bar */}
      <TrustBar />

      {/* 3. 4-Pillar Feature Grid */}
      <FeatureGrid />

      {/* 4. Realistic Examination & Assessment Dashboard Preview */}
      <AssessmentPreview />

      {/* 5. Live Campus Leaderboard Standings Preview */}
      <LeaderboardPreview />

      {/* 6. 3-Step Methodology & Workflow Pipeline */}
      <HowItWorks />

      {/* 7. Institutional Final Action Callout */}
      <FinalCTA />
    </div>
  );
}
