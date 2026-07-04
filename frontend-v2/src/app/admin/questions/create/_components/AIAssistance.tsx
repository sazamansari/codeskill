"use client";

import SectionCard from "./SectionCard";
import { Sparkles, FileText, AlertTriangle, Lightbulb, EyeOff, BookOpen, Code2, Zap, BarChart3, Copy } from "lucide-react";
import { motion } from "framer-motion";

const AI_ACTIONS = [
  { icon: FileText, label: "Generate Statement", desc: "Auto-write problem description", color: "from-blue-500 to-indigo-500" },
  { icon: AlertTriangle, label: "Generate Constraints", desc: "Suggest constraint bounds", color: "from-amber-500 to-orange-500" },
  { icon: Lightbulb, label: "Generate Examples", desc: "Create sample test cases", color: "from-emerald-500 to-teal-500" },
  { icon: EyeOff, label: "Generate Hidden Tests", desc: "Create edge case test cases", color: "from-violet-500 to-purple-500" },
  { icon: BookOpen, label: "Generate Editorial", desc: "Write solution explanation", color: "from-pink-500 to-rose-500" },
  { icon: Code2, label: "Generate Boilerplate", desc: "Create starter code templates", color: "from-cyan-500 to-blue-500" },
  { icon: Zap, label: "Optimize Question", desc: "Improve clarity and quality", color: "from-yellow-500 to-amber-500" },
  { icon: BarChart3, label: "Estimate Difficulty", desc: "AI difficulty assessment", color: "from-red-500 to-pink-500" },
  { icon: Copy, label: "Detect Duplicates", desc: "Find similar existing problems", color: "from-slate-500 to-gray-500" },
];

export default function AIAssistance() {
  return (
    <SectionCard
      id="ai-assistance"
      title="AI Assistance"
      subtitle="Use AI to auto-generate content and optimize your question."
      icon={Sparkles}
      badge="AI"
      badgeColor="bg-gradient-to-r from-indigo-500 to-violet-500 text-white"
      delay={0.6}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AI_ACTIONS.map((action, i) => (
          <motion.button
            key={action.label}
            type="button"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group relative flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-md transition-all text-left overflow-hidden"
          >
            {/* Gradient glow on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-[0.03] dark:group-hover:opacity-[0.06] transition-opacity`} />

            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <action.icon className="w-4 h-4 text-white" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{action.label}</p>
                <Sparkles className="w-3 h-3 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{action.desc}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </SectionCard>
  );
}
