"use client";

import { useTheme, Theme } from "@/context/ThemeContext";
import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ThemeToggleProps {
  className?: string;
  align?: "left" | "right";
}

export function ThemeToggle({ className = "", align = "right" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown on outside click or escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className={`w-8.5 h-8.5 rounded-lg border border-border bg-card/50 ${className}`} />
    );
  }

  // Active trigger icon based on current theme setting
  const getTriggerIcon = () => {
    if (theme === "system") {
      return <Laptop className="w-4 h-4 text-primary transition-transform duration-200" />;
    }
    if (resolvedTheme === "dark") {
      return <Moon className="w-4 h-4 text-sky-400 transition-transform duration-200" />;
    }
    return <Sun className="w-4 h-4 text-amber-500 transition-transform duration-200" />;
  };

  const options: { id: Theme; label: string; icon: React.ReactNode }[] = [
    {
      id: "light",
      label: "Light",
      icon: <Sun className="w-4 h-4 text-amber-500" />,
    },
    {
      id: "dark",
      label: "Dark",
      icon: <Moon className="w-4 h-4 text-sky-400" />,
    },
    {
      id: "system",
      label: "System",
      icon: <Laptop className="w-4 h-4 text-muted-foreground" />,
    },
  ];

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current theme: ${theme}. Click to change theme.`}
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        className="relative inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg border border-border bg-card/80 hover:bg-accent/60 text-foreground shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-95"
      >
        {getTriggerIcon()}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={`absolute ${
            align === "left" ? "left-0" : "right-0"
          } mt-2 w-36 origin-top-right rounded-xl border border-border bg-popover/95 backdrop-blur-md p-1 shadow-xl shadow-black/10 dark:shadow-black/40 z-50 animate-in fade-in zoom-in-95 duration-150`}
        >
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 border-b border-border/50 mb-1">
            Theme
          </div>
          {options.map((opt) => {
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
