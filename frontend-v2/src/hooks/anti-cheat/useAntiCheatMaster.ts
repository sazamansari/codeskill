"use client";

import { useState, useCallback, useEffect } from "react";
import { useFullscreen } from "./useFullscreen";
import { useTabVisibility } from "./useTabVisibility";
import { useKeyboardBlocker } from "./useKeyboardBlocker";
import { useCopyPasteProtect } from "./useCopyPasteProtect";
import { useDevToolsDetect } from "./useDevToolsDetect";
import api from "@/config/api"; // Assuming axios instance is here
import { io, Socket } from "socket.io-client";

interface AntiCheatConfig {
  enableFullscreen: boolean;
  enableCopyProtect: boolean;
  enablePasteProtect: boolean;
  enableDevToolsDetect: boolean;
  enableTabSwitchDetect: boolean;
  warningLimit: number;
}

export function useAntiCheatMaster(
  contestId: string,
  userId: string,
  sessionId: string,
  config: AntiCheatConfig,
  onAutoSubmit: () => void
) {
  const [warnings, setWarnings] = useState(0);
  const [lastViolation, setLastViolation] = useState<string | null>(null);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize WebSocket
  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5001", {
      path: "/socket.io",
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      newSocket.emit("join_contest", { contestId, userId, sessionId });
    });

    newSocket.on("force_submit", (data) => {
      onAutoSubmit();
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [contestId, userId, sessionId, onAutoSubmit]);

  // Central Violation Handler
  const handleViolation = useCallback(
    async (type: string, metadata: any = {}) => {
      let isLocked = false;
      setWarnings((prev) => {
        const newWarnings = prev + 1;
        if (newWarnings >= config.warningLimit) {
          isLocked = true;
          onAutoSubmit();
        }
        return newWarnings;
      });

      if (!isLocked) {
        setLastViolation(type);
        setIsWarningDialogOpen(true);
      }

      try {
        const res = await api.post("/contest-attempts/violation", {
          contestId,
          type,
          metadata,
        });

        // Backend may override warnings if we choose to sync
        if (res.data?.success) {
          if (res.data.warnings !== undefined) setWarnings(res.data.warnings);
          if (res.data.forceSubmit) {
            onAutoSubmit();
          }
        }
      } catch (err) {
        // Backend not ready or offline, but local state already caught the cheat.
        console.warn("Failed to report violation to backend, using local state.", err);
      }
    },
    [contestId, config.warningLimit, onAutoSubmit]
  );

  // Initialize individual hooks
  const { isFullscreen, requestFullscreen, hasRequested } = useFullscreen({
    enabled: config.enableFullscreen,
    onViolation: () => handleViolation("Fullscreen_Exit"),
  });

  useTabVisibility({
    enabled: config.enableTabSwitchDetect,
    onViolation: handleViolation,
  });

  useKeyboardBlocker({
    enabled: true, // Always block dangerous keys
    onViolation: handleViolation,
  });

  useCopyPasteProtect({
    enableCopyProtect: config.enableCopyProtect,
    enablePasteProtect: config.enablePasteProtect,
    onViolation: handleViolation,
  });

  useDevToolsDetect({
    enabled: config.enableDevToolsDetect,
    onViolation: handleViolation,
  });

  return {
    warnings,
    warningLimit: config.warningLimit,
    lastViolation,
    isWarningDialogOpen,
    setIsWarningDialogOpen,
    isFullscreen,
    requestFullscreen,
    hasRequestedFullscreen: hasRequested,
  };
}
