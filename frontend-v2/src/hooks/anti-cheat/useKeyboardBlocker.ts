"use client";

import { useEffect } from "react";

interface UseKeyboardBlockerOptions {
  enabled: boolean;
  onViolation: (type: string) => void;
}

export function useKeyboardBlocker({ enabled, onViolation }: UseKeyboardBlockerOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow specific safe commands inside Monaco Editor (like undo/redo)
      // Monaco handles its own bindings, but we want to intercept global bad behavior.

      // F12 / DevTools
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C"))) {
        e.preventDefault();
        onViolation("Keyboard_DevTools");
        return;
      }

      // Print
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        onViolation("Keyboard_Print");
        return;
      }

      // Save
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault(); // Just block it, no violation needed as it's common habit
        return;
      }

      // Find
      if (e.ctrlKey && e.key === "f") {
        // usually okay in code editor, but we can block global find
        // e.preventDefault();
      }
    };

    // We use capture phase to catch it before editor does
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [enabled, onViolation]);
}
