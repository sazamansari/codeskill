"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Search, Zap, BarChart3, ShieldAlert, Library, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type AIAction = 'hint' | 'explain' | 'optimize' | 'complexity' | 'edge_cases' | 'similar';

const aiActions: { id: AIAction; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'hint', label: 'Get Hint', icon: Lightbulb, color: 'text-amber-400 bg-amber-400/10' },
  { id: 'explain', label: 'Explain Failure', icon: Search, color: 'text-red-400 bg-red-400/10' },
  { id: 'optimize', label: 'Optimize Solution', icon: Zap, color: 'text-blue-400 bg-blue-400/10' },
  { id: 'complexity', label: 'Analyze Complexity', icon: BarChart3, color: 'text-emerald-400 bg-emerald-400/10' },
  { id: 'edge_cases', label: 'Find Edge Cases', icon: ShieldAlert, color: 'text-purple-400 bg-purple-400/10' },
  { id: 'similar', label: 'Similar Problems', icon: Library, color: 'text-pink-400 bg-pink-400/10' },
];

export default function AIAssistantPanel() {
  const [activeDrawer, setActiveDrawer] = useState<AIAction | null>(null);

  const getDrawerContent = (action: AIAction) => {
    switch (action) {
      case 'hint': return "Consider using a Hash Map to store elements you've already visited to achieve O(N) time complexity.";
      case 'explain': return "Your solution failed on test case 3 because it does not handle negative numbers properly.";
      case 'optimize': return "Your current time complexity is O(N^2). You can optimize this to O(N) by trading space for time.";
      case 'complexity': return "Time Complexity: O(N)\nSpace Complexity: O(N)\nYour solution scales linearly with input size.";
      case 'edge_cases': return "What happens if the array is empty?\nWhat if the array has only negative numbers?\nWhat if no valid pair exists?";
      case 'similar': return "1. 3Sum (Medium)\n2. 4Sum (Medium)\n3. Two Sum II - Input array is sorted (Medium)";
      default: return "How can I help you?";
    }
  };

  return (
    <div className="flex flex-col border-t border-[#27272A] bg-[#18181B] relative overflow-hidden">
      <div className="p-4 md:px-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          CodeSkill AI Assistant
        </h3>
      </div>

      <div className="px-4 md:px-6 pb-4 overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-3">
        {aiActions.map((action) => {
          const Icon = action.icon;
          const isActive = activeDrawer === action.id;
          
          return (
            <motion.button
              key={action.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveDrawer(isActive ? null : action.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border shrink-0",
                isActive
                  ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-300"
                  : "bg-[#27272A]/50 border-transparent hover:border-[#27272A] hover:bg-[#27272A] text-zinc-300"
              )}
            >
              <span className={cn("p-1 rounded-md", action.color)}>
                <Icon className="w-3.5 h-3.5" />
              </span>
              {action.label}
              <ChevronRight className={cn("w-3.5 h-3.5 ml-1 transition-transform", isActive ? "rotate-90 text-indigo-400" : "text-zinc-500")} />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {activeDrawer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-[#27272A] bg-[#121214]"
          >
            <div className="p-4 md:p-6 relative">
              <button 
                onClick={() => setActiveDrawer(null)}
                className="absolute top-4 right-4 p-1.5 text-zinc-500 hover:text-zinc-300 hover:bg-[#27272A] rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 pr-8">
                  <h4 className="text-sm font-semibold text-zinc-200 mb-2">
                    {aiActions.find(a => a.id === activeDrawer)?.label}
                  </h4>
                  <pre className="text-sm text-zinc-400 whitespace-pre-wrap font-sans leading-relaxed">
                    {getDrawerContent(activeDrawer)}
                  </pre>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
