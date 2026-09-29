"use client";

import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { InteractiveListSection } from "@/components/landing/InteractiveListSection";
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

      {/* 3. Interactive Matrix & System Preview */}
      <InteractiveListSection />

      {/* 4. 4-Pillar Feature Grid */}
      <FeatureGrid />

      {/* 5. Realistic Examination & Assessment Dashboard Preview */}
      <AssessmentPreview />

      {/* 6. Live Campus Leaderboard Standings Preview */}
      <LeaderboardPreview />

      {/* 7. 3-Step Methodology & Workflow Pipeline */}
      <HowItWorks />

      {/* 8. Institutional Final Action Callout */}
      <FinalCTA />
    </div>
  );
}
