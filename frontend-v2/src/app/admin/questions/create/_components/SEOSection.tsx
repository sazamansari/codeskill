"use client";

import { useState } from "react";
import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { Search, X } from "lucide-react";

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all";

const labelClass = "text-[13px] font-medium text-gray-700 dark:text-slate-300";

export default function SEOSection() {
  const { seo, updateSEO } = useQuestionStore();
  const [keywordInput, setKeywordInput] = useState("");

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && keywordInput.trim()) {
      e.preventDefault();
      const kw = keywordInput.trim().replace(/,$/, "");
      if (!seo.keywords.includes(kw)) {
        updateSEO({ keywords: [...seo.keywords, kw] });
      }
      setKeywordInput("");
    }
    if (e.key === "Backspace" && !keywordInput && seo.keywords.length > 0) {
      updateSEO({ keywords: seo.keywords.slice(0, -1) });
    }
  };

  return (
    <SectionCard
      id="seo"
      title="SEO & Meta Data"
      subtitle="Optimize search engine visibility for this problem."
      icon={Search}
      delay={0.65}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className={labelClass}>Meta Title</label>
            <input
              type="text"
              value={seo.metaTitle}
              onChange={(e) => updateSEO({ metaTitle: e.target.value })}
              placeholder="SEO title for search engines"
              className={inputClass}
            />
            <p className="text-[11px] text-gray-400 dark:text-slate-500">
              {seo.metaTitle.length}/60 characters
            </p>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>URL Slug</label>
            <input
              type="text"
              value={seo.slug}
              onChange={(e) => updateSEO({ slug: e.target.value })}
              placeholder="url-slug"
              className={`${inputClass} font-mono text-xs`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Meta Description</label>
          <textarea
            value={seo.metaDescription}
            onChange={(e) => updateSEO({ metaDescription: e.target.value })}
            rows={3}
            placeholder="Brief description for search engine results..."
            className={inputClass}
          />
          <p className="text-[11px] text-gray-400 dark:text-slate-500">
            {seo.metaDescription.length}/160 characters
          </p>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Keywords</label>
          <div className={`${inputClass} flex flex-wrap items-center gap-1.5 min-h-[42px] !p-2`}>
            {seo.keywords.map((kw) => (
              <span
                key={kw}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-xs font-medium rounded-lg"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => updateSEO({ keywords: seo.keywords.filter((k) => k !== kw) })}
                  className="hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
              placeholder={seo.keywords.length === 0 ? "Type and press Enter..." : ""}
              className="flex-1 min-w-[120px] bg-transparent text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none"
            />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
