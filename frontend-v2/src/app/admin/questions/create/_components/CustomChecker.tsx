"use client";

import { useCreateProblemStore } from "@/store/createProblemStore";
import SectionCard from "./SectionCard";
import { MonacoEditor } from "@/components/editor/MonacoEditor";
import { Shield } from "lucide-react";
import { useState } from "react";

export default function CustomChecker() {
  const { solution, updateSolution } = useCreateProblemStore();
  const [activeLang, setActiveLang] = useState<string>("cpp");

  return (
    <SectionCard
      id="custom-checker"
      title="Custom Checker"
      subtitle="Optional custom judge to verify outputs with special comparison logic."
      icon={Shield}
      badge="Optional"
      badgeColor="bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-400"
      delay={0.5}
    >
      <div className="space-y-4">
        {/* Toggle */}
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            className={`relative w-11 h-6 rounded-full transition-colors ${
              solution.hasCustomChecker ? "bg-indigo-600 dark:bg-indigo-500" : "bg-gray-300 dark:bg-slate-600"
            }`}
            onClick={() => updateSolution({ hasCustomChecker: !solution.hasCustomChecker })}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                solution.hasCustomChecker ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Enable Custom Checker
          </span>
        </label>

        {solution.hasCustomChecker && (
          <div className="space-y-4 pt-2">
            {/* Language selector */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-700 dark:text-slate-300">Checker Language</label>
              <div className="flex gap-2">
                {[
                  { id: "cpp", label: "C++" },
                  { id: "python", label: "Python" },
                  { id: "java", label: "Java" },
                ].map((lang) => (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setActiveLang(lang.id)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      activeLang === lang.id
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300"
                        : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reusable Monaco Editor */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
              <MonacoEditor
                height="300px"
                language={activeLang === "cpp" ? "cpp" : activeLang === "java" ? "java" : "python"}
                value={solution.customCheckerCode[activeLang] || ""}
                onChange={(val) => 
                  updateSolution({ 
                    customCheckerCode: { ...solution.customCheckerCode, [activeLang]: val || "" } 
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
