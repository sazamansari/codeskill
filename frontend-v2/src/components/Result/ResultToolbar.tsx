"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, CheckCircle2, ChevronDown, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Spinner } from "@/components/ui/spinner";

export interface ResultToolbarProps {
  onRun?: () => void;
  onSubmit?: () => void;
  onUpload?: () => void;
  onToggleCustomInput?: (enabled: boolean) => void;
  languages?: string[];
  selectedLanguage?: string;
  onLanguageChange?: (lang: string) => void;
  isRunLoading?: boolean;
  isSubmitLoading?: boolean;
}

export default function ResultToolbar({
  onRun,
  onSubmit,
  onUpload,
  onToggleCustomInput,
  languages = ['JavaScript', 'Python', 'Java', 'C++'],
  selectedLanguage = 'JavaScript',
  onLanguageChange,
  isRunLoading = false,
  isSubmitLoading = false,
}: ResultToolbarProps) {
  const [customInput, setCustomInput] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const handleToggleCustomInput = () => {
    const nextState = !customInput;
    setCustomInput(nextState);
    if (onToggleCustomInput) onToggleCustomInput(nextState);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-card border-b border-border rounded-t-xl">
      {/* Left side actions */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        <button
          onClick={onUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-md transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <div className="w-px h-4 bg-zinc-800 hidden sm:block" />

        <button
          onClick={handleToggleCustomInput}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
        >
          {customInput ? (
            <CheckSquare className="w-4 h-4 text-primary" />
          ) : (
            <Square className="w-4 h-4" />
          )}
          <span>Custom Input</span>
        </button>

        <div className="w-px h-4 bg-zinc-800 hidden sm:block" />

        {/* Language Selector (Basic implementation, can be replaced by shadcn select later) */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 bg-zinc-800/50 hover:bg-zinc-800 rounded-md transition-colors"
          >
            <span>{selectedLanguage}</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
          
          {langDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-card border border-border rounded-md shadow-xl overflow-hidden z-50">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(lang);
                    setLangDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs transition-colors",
                    selectedLanguage === lang 
                      ? "bg-primary/10 text-primary" 
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRun}
          disabled={isRunLoading || isSubmitLoading}
          className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg transition-colors disabled:opacity-50 min-w-[90px]"
        >
          {isRunLoading ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
          <span>Run</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          disabled={isRunLoading || isSubmitLoading}
          className="flex items-center justify-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-500 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.2)] disabled:opacity-50 min-w-[100px]"
        >
          {isSubmitLoading ? (
            <Spinner className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>Submit</span>
        </motion.button>
      </div>
    </div>
  );
}
