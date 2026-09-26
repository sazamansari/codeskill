"use client";

import { useEffect } from "react";

interface UseCopyPasteProtectOptions {
  enableCopyProtect: boolean;
  enablePasteProtect: boolean;
  onViolation: (type: string) => void;
}

export function useCopyPasteProtect({
  enableCopyProtect,
  enablePasteProtect,
  onViolation,
}: UseCopyPasteProtectOptions) {
  useEffect(() => {
    const handleCopy = (e: ClipboardEvent) => {
      if (!enableCopyProtect) return;
      e.preventDefault();
      onViolation("Clipboard_Copy");
    };

    const handleCut = (e: ClipboardEvent) => {
      if (!enableCopyProtect) return;
      e.preventDefault();
      onViolation("Clipboard_Cut");
    };

    const handlePaste = (e: ClipboardEvent) => {
      if (!enablePasteProtect) return;
      e.preventDefault();
      onViolation("Clipboard_Paste");
    };

    const handleContextMenu = (e: MouseEvent) => {
      if (!enableCopyProtect) return;
      e.preventDefault();
      onViolation("Mouse_ContextMenu");
    };

    // Attach globally with capture phase to prevent Monaco from intercepting
    document.addEventListener("copy", handleCopy, true);
    document.addEventListener("cut", handleCut, true);
    document.addEventListener("paste", handlePaste, true);
    document.addEventListener("contextmenu", handleContextMenu, true);

    return () => {
      document.removeEventListener("copy", handleCopy, true);
      document.removeEventListener("cut", handleCut, true);
      document.removeEventListener("paste", handlePaste, true);
      document.removeEventListener("contextmenu", handleContextMenu, true);
    };
  }, [enableCopyProtect, enablePasteProtect, onViolation]);
}
