"use client";

import React from "react";
import ModernLoader from "@/components/ui/modern-loader";

export function HeroCodePreview() {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center">
      <ModernLoader
        words={[
          "Compiling solution.ts...",
          "Executing Docker sandbox...",
          "Validating 42 Test Cases...",
          "Runtime: 42ms (Beats 96.4%)...",
          "Score: 94/100 • Accepted",
        ]}
        className="p-0 w-full"
      />
    </div>
  );
}
