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
      <div className={`w-8 h-8 rounded-full border border-white/[0.08] bg-white/[0.04] ${className}`} />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-[#A3A3A3] hover:text-white transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-white/40 active:scale-90 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-white transition-transform duration-300 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#3B82F6] transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}

export default ThemeToggle;
