"use client";

import React from 'react';
import { Check, X, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface TestCase {
  id: string;
  name: string;
  passed: boolean;
  isHidden?: boolean;
}

interface TestCaseSidebarProps {
  testCases: TestCase[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export default function TestCaseSidebar({ testCases, selectedId, onSelect }: TestCaseSidebarProps) {
  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col bg-[#18181B] border-r border-[#27272A] md:h-[400px]">
      <div className="p-3 border-b border-[#27272A]">
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Test Cases</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {testCases.map((tc) => {
          const isSelected = selectedId === tc.id;
          
          return (
            <motion.button
              key={tc.id}
              onClick={() => onSelect(tc.id)}
              whileHover={{ x: 2 }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative overflow-hidden",
                isSelected 
                  ? tc.passed 
                    ? "bg-green-500/10 text-green-400" 
                    : "bg-red-500/10 text-red-400"
                  : "text-zinc-400 hover:bg-[#27272A] hover:text-zinc-200"
              )}
            >
              {isSelected && (
                <motion.div 
                  layoutId="activeIndicator"
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-lg",
                    tc.passed ? "bg-green-500" : "bg-red-500"
                  )}
                />
              )}
              
              <div className="flex items-center gap-2">
                {tc.passed ? (
                  <Check className={cn("w-4 h-4", tc.passed && isSelected ? "text-green-500" : "text-green-500/70")} />
                ) : (
                  <X className={cn("w-4 h-4", !tc.passed && isSelected ? "text-red-500" : "text-red-500/70")} />
                )}
                <span className="truncate">{tc.name}</span>
              </div>
              
              {tc.isHidden && (
                <Lock className="w-3.5 h-3.5 text-zinc-600" />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
