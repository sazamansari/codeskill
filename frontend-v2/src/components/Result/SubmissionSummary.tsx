"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, CheckSquare, Code2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SubmissionSummaryProps {
  passedCount: number;
  totalCount: number;
  runtimePercentile?: number; // e.g. 82
  memoryPercentile?: number;  // e.g. 91
  language: string;
}

export default function SubmissionSummary({
  passedCount,
  totalCount,
  runtimePercentile,
  memoryPercentile,
  language
}: SubmissionSummaryProps) {
  
  const allPassed = passedCount === totalCount && totalCount > 0;
  
  return (
    <div className="bg-[#121214] border-t border-[#27272A] p-4 md:p-6 rounded-b-xl">
      <h3 className="text-sm font-semibold text-zinc-100 mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-indigo-400" />
        Submission Summary
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Passed Test Cases */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col gap-1 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Test Cases</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-2xl font-bold tracking-tight",
              allPassed ? "text-green-500" : "text-zinc-200"
            )}>
              {passedCount}
            </span>
            <span className="text-sm font-medium text-zinc-500">/ {totalCount}</span>
          </div>
        </motion.div>

        {/* Runtime */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col gap-1 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Runtime</span>
          </div>
          {runtimePercentile !== undefined ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-300">Fastest than</span>
              <span className="text-xl font-bold text-blue-400">{runtimePercentile}%</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-zinc-500 mt-1">N/A</span>
          )}
        </motion.div>

        {/* Memory */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col gap-1 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Database className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Memory</span>
          </div>
          {memoryPercentile !== undefined ? (
            <div className="flex flex-col">
              <span className="text-sm font-medium text-zinc-300">Better than</span>
              <span className="text-xl font-bold text-teal-400">{memoryPercentile}%</span>
            </div>
          ) : (
            <span className="text-sm font-medium text-zinc-500 mt-1">N/A</span>
          )}
        </motion.div>

        {/* Language */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="bg-[#18181B] border border-[#27272A] rounded-xl p-4 flex flex-col gap-1 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-zinc-400 mb-1">
            <Code2 className="w-3.5 h-3.5" />
            <span className="text-xs font-medium uppercase tracking-wider">Language</span>
          </div>
          <span className="text-lg font-semibold text-zinc-200 mt-1 truncate">
            {language}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
