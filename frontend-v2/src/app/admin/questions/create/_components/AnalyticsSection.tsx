"use client";

import { useState } from "react";
import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { BarChart3, X } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";

const labelClass = "text-[13px] font-medium text-gray-700 dark:text-slate-300";

export default function AnalyticsSection() {
  const { analytics, updateAnalytics } = useQuestionStore();
  const [companyInput, setCompanyInput] = useState("");
  const [uniInput, setUniInput] = useState("");

  const handleCompanyKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && companyInput.trim()) {
      e.preventDefault();
      const val = companyInput.trim().replace(/,$/, "");
      if (!analytics.recommendedCompanies.includes(val)) {
        updateAnalytics({ recommendedCompanies: [...analytics.recommendedCompanies, val] });
      }
      setCompanyInput("");
    }
  };

  const handleUniKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && uniInput.trim()) {
      e.preventDefault();
      const val = uniInput.trim().replace(/,$/, "");
      if (!analytics.recommendedUniversities.includes(val)) {
        updateAnalytics({ recommendedUniversities: [...analytics.recommendedUniversities, val] });
      }
      setUniInput("");
    }
  };

  return (
    <SectionCard
      id="analytics"
      title="Analytics & Recommendations"
      subtitle="Set expected metrics and recommendations."
      icon={BarChart3}
      delay={0.7}
    >
      <div className="space-y-5">
        {/* Acceptance Rate Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Expected Acceptance Rate</label>
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
              {analytics.expectedAcceptanceRate}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={analytics.expectedAcceptanceRate}
            onChange={(e) => updateAnalytics({ expectedAcceptanceRate: Number(e.target.value) })}
            className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-gray-400 dark:text-slate-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Runtime + Memory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Average Runtime</label>
            <input
              type="text"
              value={analytics.avgRuntime}
              onChange={(e) => updateAnalytics({ avgRuntime: e.target.value })}
              placeholder="e.g. 12ms"
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Average Memory</label>
            <input
              type="text"
              value={analytics.avgMemory}
              onChange={(e) => updateAnalytics({ avgMemory: e.target.value })}
              placeholder="e.g. 42.5 MB"
              className={inputClass}
            />
          </div>
        </div>

        {/* Recommended Companies */}
        <div className="space-y-1.5">
          <label className={labelClass}>Recommended Companies</label>
          <div className={`${inputClass} flex flex-wrap items-center gap-1.5 min-h-[42px] !p-2`}>
            {analytics.recommendedCompanies.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-lg"
              >
                {c}
                <button
                  type="button"
                  onClick={() => updateAnalytics({ recommendedCompanies: analytics.recommendedCompanies.filter((x) => x !== c) })}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={companyInput}
              onChange={(e) => setCompanyInput(e.target.value)}
              onKeyDown={handleCompanyKey}
              placeholder={analytics.recommendedCompanies.length === 0 ? "e.g. Google, Meta, Amazon..." : ""}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>

        {/* Recommended Universities */}
        <div className="space-y-1.5">
          <label className={labelClass}>Recommended Universities</label>
          <div className={`${inputClass} flex flex-wrap items-center gap-1.5 min-h-[42px] !p-2`}>
            {analytics.recommendedUniversities.map((u) => (
              <span
                key={u}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg"
              >
                {u}
                <button
                  type="button"
                  onClick={() => updateAnalytics({ recommendedUniversities: analytics.recommendedUniversities.filter((x) => x !== u) })}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={uniInput}
              onChange={(e) => setUniInput(e.target.value)}
              onKeyDown={handleUniKey}
              placeholder={analytics.recommendedUniversities.length === 0 ? "e.g. MIT, Stanford, IIT..." : ""}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 outline-none"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
