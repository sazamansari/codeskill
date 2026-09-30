"use client";

import { Hero } from "@/components/landing/Hero";
import { TrustBar } from "@/components/landing/TrustBar";
import { CodingExperience } from "@/components/landing/CodingExperience";
import { FeatureGrid } from "@/components/landing/FeatureGrid";
import { AssessmentPreview } from "@/components/landing/AssessmentPreview";
import { StudentAnalyticsPreview } from "@/components/landing/StudentAnalyticsPreview";
import { InstitutionalSection } from "@/components/landing/InstitutionalSection";
import { SupportedLanguages } from "@/components/landing/SupportedLanguages";
import { InteractiveListSection } from "@/components/landing/InteractiveListSection";
import { LeaderboardPreview } from "@/components/landing/LeaderboardPreview";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col w-full font-sans bg-background text-foreground selection:bg-amber-400/30 selection:text-amber-900 dark:selection:text-amber-200">
      {/* 1. Hero Section with 50/50 Split & Realistic Coding Interface */}
      <Hero />

      {/* 2. Compact Product Capability & Trust Highlights */}
      <TrustBar />

      {/* 3. Online Judge & Interactive Coding Experience (Code. Run. Improve.) */}
      <CodingExperience />

      {/* 4. Platform Features (Everything you need to become interview-ready) */}
      <FeatureGrid />

      {/* 5. Assessment Architecture (Assess skills with confidence) */}
      <AssessmentPreview />

      {/* 6. Student Dashboard & Skill Analytics Preview (247 Solved, 21-day Streak) */}
      <StudentAnalyticsPreview />

      {/* 7. Institutional & University Section (Built for classrooms, assessments, and hiring) */}
      <InstitutionalSection />

      {/* 8. Polyglot Supported Languages (One platform. Multiple languages. Instant evaluation.) */}
      <SupportedLanguages />

      {/* 9. Live Campus Leaderboard Standings Preview */}
      <LeaderboardPreview />

      {/* 10. Interactive Matrix Preview (GSAP-accelerated) */}
      <InteractiveListSection />

      {/* 11. Final Action Callout (Start building better coding skills today) */}
      <FinalCTA />
    </div>
  );
}
