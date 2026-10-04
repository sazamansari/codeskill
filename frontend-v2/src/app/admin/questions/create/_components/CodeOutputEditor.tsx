"use client";

import { useQuestionStore, ALL_LANGUAGES } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { Code2 } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2.5 bg-muted/50 dark:bg-card border border-border dark:border-border rounded-xl text-sm text-foreground dark:text-white placeholder:text-gray-400 dark:placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:ring-indigo-400/20 dark:focus:border-indigo-400 transition-all";

const labelClass = "text-[13px] font-medium text-gray-700 dark:text-slate-300 mb-1.5 block";

export default function CodeOutputEditor() {
  const { codeOutput, updateCodeOutput } = useQuestionStore();

  return (
    <SectionCard
      id="code-output"
      title="Code Output Snippet"
      subtitle="Define the code snippet and the expected console output."
      icon={Code2}
      delay={0.1}
    >
      <div className="space-y-5">
        <div>
          <label className={labelClass}>Programming Language</label>
          <select
            value={codeOutput.language}
            onChange={(e) => updateCodeOutput({ language: e.target.value })}
            className={inputClass}
          >
            {ALL_LANGUAGES.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.icon} {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Code Snippet</label>
          <textarea
            rows={8}
            placeholder="// Enter the code snippet candidates will analyze"
            value={codeOutput.code}
            onChange={(e) => updateCodeOutput({ code: e.target.value })}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>

        <div>
          <label className={labelClass}>Expected Output</label>
          <textarea
            rows={4}
            placeholder="Enter the exact expected output candidates should guess"
            value={codeOutput.expectedOutput}
            onChange={(e) => updateCodeOutput({ expectedOutput: e.target.value })}
            className={`${inputClass} font-mono text-xs`}
          />
        </div>
      </div>
    </SectionCard>
  );
}
