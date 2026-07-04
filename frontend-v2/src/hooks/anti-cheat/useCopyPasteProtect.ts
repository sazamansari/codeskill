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

    // Attach globally
    document.addEventListener("copy", handleCopy);
    document.addEventListener("cut", handleCut);
    document.addEventListener("paste", handlePaste);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("cut", handleCut);
      document.removeEventListener("paste", handlePaste);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [enableCopyProtect, enablePasteProtect, onViolation]);
}
