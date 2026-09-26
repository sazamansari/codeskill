"use client";

import { useEffect } from "react";

interface UseDevToolsDetectOptions {
  enabled: boolean;
  onViolation: (type: string) => void;
}

export function useDevToolsDetect({ enabled, onViolation }: UseDevToolsDetectOptions) {
  useEffect(() => {
    if (!enabled) return;

    let devtoolsOpen = false;

    // Technique 1: Window size threshold check (crude but effective)
    const checkWindowSize = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      if (widthThreshold || heightThreshold) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          onViolation("DevTools_Resized");
        }
      } else {
        devtoolsOpen = false;
      }
    };

    window.addEventListener("resize", checkWindowSize);

    // Technique 2: Debugger statement check
    const checkDebugger = setInterval(() => {
      const start = performance.now();
      debugger; // This halts execution if devtools is open
      const end = performance.now();
      
      if (end - start > 100) {
        onViolation("DevTools_DebuggerPaused");
      }
    }, 3000);

    return () => {
      window.removeEventListener("resize", checkWindowSize);
      clearInterval(checkDebugger);
    };
  }, [enabled, onViolation]);
}
