"use client";

import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { CodingExperience } from "@/components/landing/CodingExperience";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { ProblemTablePreview } from "@/components/landing/ProblemTablePreview";
import { AssessmentPreview } from "@/components/landing/AssessmentPreview";
import { StudentAnalyticsPreview } from "@/components/landing/StudentAnalyticsPreview";
import { InstitutionalSection } from "@/components/landing/InstitutionalSection";
import { SupportedLanguages } from "@/components/landing/SupportedLanguages";
import { InteractiveListSection } from "@/components/landing/InteractiveListSection";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full font-sans bg-background text-foreground selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* 1. Hero Section with Realistic Coding Interface */}
      <Hero />

      {/* 2. Compact Product Capability & Trust Highlights */}
      <TrustBar />

      {/* 3. Problem List Section (LeetCode-style Problem Table) */}
      <ProblemTablePreview />

      {/* 4. Online Judge & Interactive Coding Experience (Code. Run. Improve.) */}
      <CodingExperience />

      {/* 5. Platform Features (Everything you need to improve your coding skills) */}
      <FeatureGrid />

      {/* 6. Assessment Architecture (DSA, Frontend, Backend, Full Stack) */}
      <AssessmentPreview />

      {/* 7. Student Developer Dashboard (247 Solved, Recent Activity Table) */}
      <StudentAnalyticsPreview />

      {/* 8. Institutional & Admin Dashboard Section */}
      <InstitutionalSection />

      {/* 9. Polyglot Supported Languages (C++, Java, Python, JS, TS, C) */}
      <SupportedLanguages />

      {/* 10. Live Campus Leaderboard Standings */}
      <LeaderboardPreview />

      {/* 11. Interactive Assessment Matrix */}
      <InteractiveListSection />

      {/* 12. Final Action Callout */}
      <FinalCTA />
    </div>
  );
}
