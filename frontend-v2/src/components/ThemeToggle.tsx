"use client";

import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-8.5 h-8.5 rounded-full border border-neutral-200 dark:border-white/[0.08] bg-neutral-100/50 dark:bg-white/[0.04] ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center w-8.5 h-8.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100/80 dark:bg-white/[0.04] hover:bg-neutral-200 dark:hover:bg-white/[0.08] hover:border-neutral-300 dark:hover:border-white/20 text-neutral-600 dark:text-[#A3A3A3] hover:text-neutral-900 dark:hover:text-white transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-white/40 active:scale-90 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 dark:text-white transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#2563EB] transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
