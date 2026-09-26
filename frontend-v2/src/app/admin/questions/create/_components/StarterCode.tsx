"use client";

import { useState } from "react";
import { useQuestionStore, ALL_LANGUAGES } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import Editor from "@monaco-editor/react";
import { Code2 } from "lucide-react";

export default function StarterCode() {
  const { languages, starterCode, setStarterCode, isDarkMode } = useQuestionStore();
  const [activeTab, setActiveTab] = useState(languages.supported[0] || "javascript");

  const supportedLangs = ALL_LANGUAGES.filter((l) => languages.supported.includes(l.id));

  return (
    <SectionCard
      id="starter-code"
      title="Starter Code"
      subtitle="Provide the initial boilerplate code shown to candidates."
      icon={Code2}
      delay={0.35}
    >
      <div className="space-y-4">
        {/* Language Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-gray-100 dark:border-white/[0.04] pb-1">
          {supportedLangs.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setActiveTab(lang.id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 transition-all rounded-t-md ${
                activeTab === lang.id
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5"
                  : "border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300 hover:border-gray-300 dark:hover:border-slate-600"
              }`}
            >
              <span className="mr-1.5">{lang.icon}</span>
              {lang.label}
            </button>
          ))}
        </div>

        {/* Monaco Editor */}
        <div className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-[#1e1e1e]">
          <Editor
            height="380px"
            language={ALL_LANGUAGES.find((l) => l.id === activeTab)?.monacoId || "plaintext"}
            theme="vs-dark"
            value={starterCode[activeTab] || ""}
            onChange={(value) => setStarterCode(activeTab, value || "")}
            options={{
              minimap: { enabled: false },
              padding: { top: 16 },
              fontSize: 14,
              scrollBeyondLastLine: false,
              renderLineHighlightOnlyWhenFocus: true,
            }}
          />
        </div>

        {supportedLangs.length === 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl px-4 py-3">
            Please select at least one programming language in the Languages section above.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
