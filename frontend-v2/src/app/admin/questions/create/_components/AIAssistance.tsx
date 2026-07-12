"use client";

import { useState } from "react";
import SectionCard from "./SectionCard";
import { Sparkles, FileText, AlertTriangle, Lightbulb, EyeOff, BookOpen, Code2, Zap, BarChart3, Copy, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io } from "socket.io-client";
import { useCreateProblemStore } from "@/store/createProblemStore";

const AI_ACTIONS = [
  { id: "statement", icon: FileText, label: "Generate Statement", desc: "Auto-write problem description", color: "from-blue-500 to-indigo-500" },
  { id: "constraints", icon: AlertTriangle, label: "Generate Constraints", desc: "Suggest constraint bounds", color: "from-amber-500 to-orange-500" },
  { id: "examples", icon: Lightbulb, label: "Generate Examples", desc: "Create sample test cases", color: "from-emerald-500 to-teal-500" },
  { id: "editorial", icon: BookOpen, label: "Generate Editorial", desc: "Write solution explanation", color: "from-pink-500 to-rose-500" },
];

export default function AIAssistance() {
  const { problem, updateStatement } = useCreateProblemStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState("");

  const handleGenerate = async (actionId: string, actionLabel: string) => {
    if (!problem.title) {
      alert("Please enter a problem title first so the AI has context.");
      return;
    }

    setIsGenerating(true);
    setActiveTask(actionLabel);
    setStreamingText("");

    try {
      // 1. Trigger the HTTP 202 endpoint
      const res = await fetch("http://localhost:5000/api/admin/problems/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          prompt: `Generate ${actionLabel} for a coding problem titled: ${problem.title}`,
          type: actionId 
        }),
      });

      const data = await res.json();
      if (!data.success || !data.jobId) {
        throw new Error("Failed to start AI generation job");
      }

      // 2. Connect to the WebSocket namespace
      const socket = io("http://localhost:5000/ai-generation", { transports: ['websocket'] });

      socket.on("connect", () => {
        // 3. Join the specific job room
        socket.emit("join_job", { jobId: data.jobId });
      });

      socket.on("stream_chunk", (payload) => {
        // 4. Append streaming chunks to state
        setStreamingText((prev) => prev + payload.chunk);
      });

      socket.on("job_complete", (payload) => {
        // 5. Hydrate the Zustand store based on the action type
        if (actionId === "statement") {
          updateStatement({ description: payload.result });
        }
        
        setTimeout(() => {
          socket.disconnect();
          setIsGenerating(false);
          setActiveTask(null);
        }, 1500); // Wait a moment to let the user read the final text
      });

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
      setActiveTask(null);
      alert("Failed to connect to AI service.");
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
        {AI_ACTIONS.map((action) => (
          <motion.button
            key={action.id}
            type="button"
            disabled={isGenerating}
            onClick={() => handleGenerate(action.id, action.label)}
            whileHover={!isGenerating ? { scale: 1.02, y: -2 } : {}}
            whileTap={!isGenerating ? { scale: 0.98 } : {}}
            className={`group relative flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 transition-all text-left overflow-hidden ${isGenerating ? 'opacity-50 cursor-not-allowed' : 'hover:border-indigo-200 hover:shadow-md'}`}
          >
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

        {/* Streaming Overlay */}
        <AnimatePresence>
          {isGenerating && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 z-10 bg-slate-900/95 backdrop-blur-sm rounded-xl p-4 flex flex-col border border-indigo-500/50 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white">Generating: {activeTask}...</span>
                </div>
                <button type="button" onClick={() => setIsGenerating(false)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto text-sm text-indigo-100 font-mono whitespace-pre-wrap leading-relaxed custom-scrollbar">
                {streamingText}
                <span className="inline-block w-2 h-4 bg-indigo-400 animate-pulse ml-1 align-middle"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}
