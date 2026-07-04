"use client";

import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import Editor from "@monaco-editor/react";
import { Shield } from "lucide-react";

export default function CustomChecker() {
  const { customChecker, updateCustomChecker, isDarkMode } = useQuestionStore();

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
              customChecker.enabled ? "bg-indigo-600 dark:bg-indigo-500" : "bg-gray-300 dark:bg-slate-600"
            }`}
            onClick={() => updateCustomChecker({ enabled: !customChecker.enabled })}
          >
            <div
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                customChecker.enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </div>
          <span className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Enable Custom Checker
          </span>
        </label>

        {customChecker.enabled && (
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
                    onClick={() => updateCustomChecker({ language: lang.id })}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                      customChecker.language === lang.id
                        ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-300"
                        : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-600"
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
              <Editor
                height="300px"
                language={customChecker.language === "cpp" ? "cpp" : customChecker.language === "java" ? "java" : "python"}
                theme="vs-dark"
                value={customChecker.code}
                onChange={(value) => updateCustomChecker({ code: value || "" })}
                options={{
                  minimap: { enabled: false },
                  padding: { top: 16 },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  renderLineHighlightOnlyWhenFocus: true,
                }}
              />
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
