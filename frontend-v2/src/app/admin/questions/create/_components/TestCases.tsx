"use client";

import { useQuestionStore } from "../_store/useQuestionStore";
import SectionCard from "./SectionCard";
import { Plus, Trash2, Eye, EyeOff, Upload, Shuffle, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const inputClass =
  "w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono";

export default function TestCases() {
  const { testCases, addTestCase, updateTestCase, removeTestCase } = useQuestionStore();

  const publicCount = testCases.filter((tc) => !tc.isHidden).length;
  const hiddenCount = testCases.filter((tc) => tc.isHidden).length;

  return (
    <SectionCard
      id="test-cases"
      title="Test Cases"
      subtitle="Add public and hidden test cases for validation."
      icon={Database}
      delay={0.45}
    >
      <div className="space-y-5">
        {/* Stats bar */}
        {testCases.length > 0 && (
          <div className="flex items-center gap-4 text-xs">
            <span className="px-2.5 py-1 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 rounded-lg font-medium">
              {publicCount} Public
            </span>
            <span className="px-2.5 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-lg font-medium">
              {hiddenCount} Hidden
            </span>
            <span className="px-2.5 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg font-medium">
              {testCases.length} Total
            </span>
          </div>
        )}

        {/* Bulk upload zone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "CSV Upload", icon: Upload, format: ".csv" },
            { label: "JSON Upload", icon: Upload, format: ".json" },
            { label: "ZIP Upload", icon: Upload, format: ".zip" },
          ].map((upload) => (
            <button
              key={upload.label}
              type="button"
              className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 dark:border-slate-600 rounded-xl text-sm font-medium text-gray-500 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 transition-all"
            >
              <upload.icon className="w-4 h-4" />
              {upload.label}
            </button>
          ))}
        </div>

        {/* Generate random */}
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 rounded-xl text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
        >
          <Shuffle className="w-4 h-4" /> Generate Random Test Cases
        </button>

        {/* Test case list */}
        <AnimatePresence mode="popLayout">
          {testCases.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-10 bg-gray-50 dark:bg-slate-800/50 border border-dashed border-gray-200 dark:border-slate-700 rounded-xl"
            >
              <Database className="w-8 h-8 text-gray-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-sm text-gray-500 dark:text-slate-400">No test cases added yet.</p>
              <button
                type="button"
                onClick={addTestCase}
                className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
              >
                Add your first test case
              </button>
            </motion.div>
          ) : (
            testCases.map((tc, index) => (
              <motion.div
                key={tc.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-gray-50/50 dark:bg-slate-800/30"
              >
                {/* Header */}
                <div className="bg-white dark:bg-slate-800/50 px-4 py-3 border-b border-gray-100 dark:border-white/[0.04] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700 dark:text-slate-300">
                      Test Case #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateTestCase(tc.id, { isHidden: !tc.isHidden })}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                        tc.isHidden
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                          : "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                      }`}
                    >
                      {tc.isHidden ? (
                        <>
                          <EyeOff className="w-3 h-3" /> Hidden
                        </>
                      ) : (
                        <>
                          <Eye className="w-3 h-3" /> Public
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-gray-500 dark:text-slate-500">Weight:</label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={tc.weight}
                        onChange={(e) => updateTestCase(tc.id, { weight: Number(e.target.value) })}
                        className="w-14 px-2 py-1 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-xs text-center text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestCase(tc.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                      Input
                    </label>
                    <textarea
                      value={tc.input}
                      onChange={(e) => updateTestCase(tc.id, { input: e.target.value })}
                      rows={3}
                      placeholder="Test case input..."
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                      Expected Output
                    </label>
                    <textarea
                      value={tc.output}
                      onChange={(e) => updateTestCase(tc.id, { output: e.target.value })}
                      rows={3}
                      placeholder="Expected output..."
                      className={inputClass}
                    />
                  </div>
                  {!tc.isHidden && (
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[11px] font-medium text-gray-500 dark:text-slate-500 uppercase tracking-wider">
                        Explanation (Optional)
                      </label>
                      <input
                        type="text"
                        value={tc.explanation}
                        onChange={(e) => updateTestCase(tc.id, { explanation: e.target.value })}
                        placeholder="Explain the expected output..."
                        className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Add button */}
        <button
          type="button"
          onClick={addTestCase}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm font-medium text-gray-600 dark:text-slate-400 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 dark:hover:bg-indigo-500/10 dark:hover:border-indigo-500/30 dark:hover:text-indigo-400 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Test Case
        </button>
      </div>
    </SectionCard>
  );
}
