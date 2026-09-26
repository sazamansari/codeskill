"use client";

import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { Plus, Trash2, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono";

export default function SampleTestCases() {
  const { sampleExamples, addSampleExample, updateSampleExample, removeSampleExample } =
    useQuestionStore();

  return (
    <SectionCard
      id="sample-test-cases"
      title="Sample Test Cases"
      subtitle="Add examples visible to candidates with explanations."
      icon={Lightbulb}
      delay={0.3}
    >
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sampleExamples.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl"
            >
              <Lightbulb className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">No sample examples yet.</p>
              <button
                type="button"
                onClick={addSampleExample}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
              >
                Add your first example
              </button>
            </motion.div>
          ) : (
            sampleExamples.map((ex) => (
              <motion.div
                key={ex.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-slate-800/30"
              >
                {/* Header */}
                <div className="bg-white dark:bg-slate-800/50 px-4 py-3 border-b border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs font-bold">
                      {ex.number}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-300">
                      Example {ex.number}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSampleExample(ex.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                        Input
                      </label>
                      <textarea
                        value={ex.input}
                        onChange={(e) => updateSampleExample(ex.id, { input: e.target.value })}
                        rows={3}
                        placeholder="e.g. nums = [2,7,11,15], target = 9"
                        className={inputClass}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                        Output
                      </label>
                      <textarea
                        value={ex.output}
                        onChange={(e) => updateSampleExample(ex.id, { output: e.target.value })}
                        rows={3}
                        placeholder="e.g. [0,1]"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                      Explanation
                    </label>
                    <input
                      type="text"
                      value={ex.explanation}
                      onChange={(e) => updateSampleExample(ex.id, { explanation: e.target.value })}
                      placeholder="e.g. Because nums[0] + nums[1] == 9, we return [0, 1]."
                      className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Add button */}
        <button
          type="button"
          onClick={addSampleExample}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Example
        </button>
      </div>
    </SectionCard>
  );
}
