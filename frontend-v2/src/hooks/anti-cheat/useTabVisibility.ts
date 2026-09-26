"use client";

import { useEffect } from "react";

interface UseTabVisibilityOptions {
  enabled: boolean;
  onViolation: (type: string) => void;
}

export function useTabVisibility({ enabled, onViolation }: UseTabVisibilityOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        onViolation("TabSwitch_VisibilityHidden");
      }
    };

    const handleBlur = () => {
      onViolation("TabSwitch_WindowBlur");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [enabled, onViolation]);
}
