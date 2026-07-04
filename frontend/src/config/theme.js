export const LIGHT = {
  bg: "#F4F6FB", bgWhite: "#FFFFFF", bgPanel: "#F8FAFC", bgEditor: "#FCFCFD",
  bgHover: "#EEF2FF", bgActive: "#E0E7FF", bgMuted: "#F1F5F9",
  border: "#E2E8F0", borderLight: "#F1F5F9", borderAccent: "#C7D2FE",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8", textFaint: "#CBD5E1",
  accent: "#4F46E5", accentLight: "#818CF8", accentDim: "#3730A3", accentBg: "#EEF2FF",
  green: "#16A34A", greenBg: "#DCFCE7", greenBorder: "#BBF7D0",
  red: "#DC2626", redBg: "#FEE2E2", redBorder: "#FECACA",
  yellow: "#D97706", yellowBg: "#FEF3C7",
  purple: "#7C3AED", cyan: "#0891B2", orange: "#EA580C",
  shadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)",
  shadowLg: "0 10px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)",
  gradient: "linear-gradient(135deg, #4F46E5, #2563EB, #0891B2)",
  gradientSoft: "linear-gradient(135deg, #EEF2FF, #E0F2FE)",
  isDark: false,
};

export const DARK = {
  bg: "#0D1117", bgWhite: "#161B22", bgPanel: "#161B22", bgEditor: "#0D1117",
  bgHover: "#1C2333", bgActive: "#1F2937", bgMuted: "#21262D",
  border: "#30363D", borderLight: "#21262D", borderAccent: "#4F46E5",
  text: "#E6EDF3", textSec: "#8B949E", textMuted: "#484F58", textFaint: "#30363D",
  accent: "#818CF8", accentLight: "#A5B4FC", accentDim: "#4F46E5", accentBg: "#1E1B4B22",
  green: "#22C55E", greenBg: "#166534", greenBorder: "#15803D",
  red: "#F87171", redBg: "#991B1B", redBorder: "#B91C1C",
  yellow: "#FBBF24", yellowBg: "#92400E",
  purple: "#A78BFA", cyan: "#22D3EE", orange: "#FB923C",
  shadow: "0 1px 3px rgba(0,0,0,0.3)",
  shadowMd: "0 4px 12px rgba(0,0,0,0.4)",
  shadowLg: "0 10px 32px rgba(0,0,0,0.5)",
  gradient: "linear-gradient(135deg, #818CF8, #3B82F6, #22D3EE)",
  gradientSoft: "linear-gradient(135deg, #1E1B4B, #172554)",
  isDark: true,
};

export const CAT_TAGS = {
  light: {
    Programming: { label: "DSA", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", icon: "🧮" },
    Database: { label: "SQL", color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC", icon: "🗄️" },
    Web: { label: "JavaScript", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "⚡" },
  },
  dark: {
    Programming: { label: "DSA", color: "#A78BFA", bg: "#2E1065", border: "#6D28D9", icon: "🧮" },
    Database: { label: "SQL", color: "#22D3EE", bg: "#083344", border: "#0E7490", icon: "🗄️" },
    Web: { label: "JavaScript", color: "#FBBF24", bg: "#451A03", border: "#92400E", icon: "⚡" },
  },
};
