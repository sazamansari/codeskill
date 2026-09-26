"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  children: ReactNode;
  badge?: string;
  badgeColor?: string;
  delay?: number;
}

export default function SectionCard({
  id,
  title,
  subtitle,
  icon: Icon,
  children,
  badge,
  badgeColor = "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300",
  delay = 0,
}: SectionCardProps) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative group"
    >
      {/* Gradient accent bar */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />

      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.06] rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-500/20 dark:to-violet-500/20 flex items-center justify-center flex-shrink-0">
              <Icon className="w-[18px] h-[18px] text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-gray-900 dark:text-white tracking-tight">
                  {title}
                </h2>
                {badge && (
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-[13px] text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </motion.div>
  );
}
