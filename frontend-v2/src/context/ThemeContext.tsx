"use client";

import React, { createContext, useContext, useState } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resolvedTheme: string;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
  resolvedTheme: "light",
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
}: {
  children: React.ReactNode;
  defaultTheme?: string;
  [key: string]: any;
}) {
  const [theme, setTheme] = useState<string>(defaultTheme);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme: theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
