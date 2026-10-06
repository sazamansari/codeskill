"use client";

import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { ListChecks, Plus, Trash2, Check } from "lucide-react";
import { useToast } from "./Toast";

const inputClass =
  "w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all";

export default function MCQEditor() {
  const { metadata, mcqOptions, updateMCQOptions } = useQuestionStore();
  const { addToast } = useToast();

  const isMultiple = metadata.questionType === "MULTIPLE_CHOICE";
  const isTrueFalse = metadata.questionType === "TRUE_FALSE";

  const handleOptionTextChange = (index: number, val: string) => {
    const next = [...mcqOptions];
    next[index] = { ...next[index], text: val };
    updateMCQOptions(next);
  };

  const handleOptionExplanationChange = (index: number, val: string) => {
    const next = [...mcqOptions];
    next[index] = { ...next[index], explanation: val };
    updateMCQOptions(next);
  };

  const handleCorrectToggle = (index: number) => {
    if (!isMultiple) {
      updateMCQOptions(mcqOptions.map((opt, i) => ({ ...opt, isCorrect: i === index })));
    } else {
      const next = [...mcqOptions];
      next[index] = { ...next[index], isCorrect: !next[index].isCorrect };
      updateMCQOptions(next);
    }
  };

  const handleAddOption = () => {
    updateMCQOptions([...mcqOptions, { text: "", isCorrect: false, explanation: "" }]);
  };

  const handleRemoveOption = (index: number) => {
    if (mcqOptions.length <= (isTrueFalse ? 2 : 4)) {
      addToast("error", "Minimum Options", `At least ${isTrueFalse ? 2 : 4} options are required.`);
      return;
    }
    updateMCQOptions(mcqOptions.filter((_, i) => i !== index));
  };

  return (
    <SectionCard
      id="mcq-options"
      title="Answer Options"
      subtitle={
        isMultiple 
          ? "Check all options that are correct. (Minimum 4 options required)"
          : isTrueFalse
          ? "Configure True/False options."
          : "Select the single correct answer. (Minimum 4 options required)"
      }
      icon={ListChecks}
      delay={0.1}
    >
      <div className="flex items-start justify-end mb-4">
        {!isTrueFalse && (
          <button
            type="button"
            onClick={handleAddOption}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/70 text-foreground transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Option
          </button>
        )}
      </div>

      <div className="space-y-3">
        {mcqOptions.map((opt, idx) => (
          <div
            key={idx}
            className={`rounded-lg border transition-all ${
              opt.isCorrect
                ? "border-emerald-500/30 bg-emerald-500/5"
                : "border-border bg-background"
            }`}
          >
            <div className="flex items-start gap-3 p-3.5">
              <button
                type="button"
                onClick={() => handleCorrectToggle(idx)}
                title={opt.isCorrect ? "Correct" : "Mark as correct"}
                className={`mt-0.5 w-5 h-5 ${isMultiple ? "rounded" : "rounded-full"} flex items-center justify-center shrink-0 border transition-all ${
                  opt.isCorrect
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-border bg-background hover:border-emerald-500/60"
                }`}
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </button>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground/70">
                    {isTrueFalse ? (idx === 0 ? "True" : "False") : `Option ${String.fromCharCode(65 + idx)}`}
                    {opt.isCorrect && (
                      <span className="ml-2 text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
                        CORRECT
                      </span>
                    )}
                  </span>
                  {!isTrueFalse && mcqOptions.length > 4 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="text-muted-foreground hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                
                {!isTrueFalse && (
                  <input
                    type="text"
                    placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                    value={opt.text}
                    onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                    className={inputClass}
                  />
                )}
                
                <input
                  type="text"
                  placeholder="Explanation for this option (shown post-assessment)"
                  value={opt.explanation}
                  onChange={(e) => handleOptionExplanationChange(idx, e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-xs text-muted-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
