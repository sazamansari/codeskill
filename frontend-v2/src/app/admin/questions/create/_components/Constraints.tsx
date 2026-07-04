"use client";

import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import Editor from "@monaco-editor/react";
import { AlertTriangle } from "lucide-react";

export default function Constraints() {
  const { statement, updateStatement, isDarkMode } = useQuestionStore();

  return (
    <SectionCard
      id="constraints"
      title="Constraints"
      subtitle="Define the input constraints and bounds."
      icon={AlertTriangle}
      delay={0.2}
    >
      <div className="space-y-3">
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
          <Editor
            height="180px"
            language="markdown"
            theme={isDarkMode ? "vs-dark" : "light"}
            value={statement.constraints}
            onChange={(value) => updateStatement({ constraints: value || "" })}
            options={{
              minimap: { enabled: false },
              padding: { top: 12 },
              scrollBeyondLastLine: false,
              lineNumbers: "off",
              wordWrap: "on",
              fontSize: 14,
              renderLineHighlightOnlyWhenFocus: true,
            }}
          />
        </div>

        {/* Hint examples */}
        <div className="flex flex-wrap gap-2">
          {[
            "1 ≤ n ≤ 10^5",
            "-10^9 ≤ nums[i] ≤ 10^9",
            "1 ≤ s.length ≤ 10^4",
          ].map((hint) => (
            <button
              key={hint}
              type="button"
              onClick={() => {
                const current = statement.constraints;
                updateStatement({
                  constraints: current ? `${current}\n${hint}` : hint,
                });
              }}
              className="px-3 py-1.5 text-xs font-mono bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 transition-all cursor-pointer"
            >
              + {hint}
            </button>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
