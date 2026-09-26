"use client";

import { useEffect, useState, useCallback } from "react";

interface UseFullscreenOptions {
  enabled: boolean;
  onViolation: () => void;
}

export function useFullscreen({ enabled, onViolation }: UseFullscreenOptions) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const requestFullscreen = useCallback(async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else if ((document.documentElement as any).webkitRequestFullscreen) {
        await (document.documentElement as any).webkitRequestFullscreen();
      } else if ((document.documentElement as any).msRequestFullscreen) {
        await (document.documentElement as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
      setHasRequested(true);
    } catch (err) {
      console.error("Failed to enter fullscreen:", err);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      setIsFullscreen(isCurrentlyFullscreen);

      // If they were in fullscreen and exited it, that's a violation
      if (!isCurrentlyFullscreen && hasRequested) {
        onViolation();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
    };
  }, [enabled, hasRequested, onViolation]);

  return { isFullscreen, requestFullscreen, hasRequested };
}
