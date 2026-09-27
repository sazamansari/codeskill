"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
  resolvedTheme: "light",
  toggleTheme: () => {},
});

const STORAGE_KEY = "codeskill_theme";

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  [key: string]: any;
}) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);

  // Helper to determine system theme
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  // Helper to apply class and colorScheme to html
  const applyThemeToDOM = useCallback((currentTheme: Theme) => {
    if (typeof window === "undefined") return;
    const resolved: ResolvedTheme = currentTheme === "system" ? getSystemTheme() : (currentTheme as ResolvedTheme);
    setResolvedTheme(resolved);

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  }, []);

  // Initialize theme from storage on mount
  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme = defaultTheme;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        initialTheme = stored;
      }
    } catch (_) {}

    setThemeState(initialTheme);
    applyThemeToDOM(initialTheme);
  }, [defaultTheme, applyThemeToDOM]);

  // Update theme when state changes
  useEffect(() => {
    if (!mounted) return;
    applyThemeToDOM(theme);

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme, mounted, applyThemeToDOM]);

  // Listen to OS system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        applyThemeToDOM("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyThemeToDOM]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      if (prev === "system") {
        const currentSystem = getSystemTheme();
        return currentSystem === "dark" ? "light" : "dark";
      }
      return prev === "dark" ? "light" : "dark";
    });
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
