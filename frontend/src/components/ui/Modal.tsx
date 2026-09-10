"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/** The first real modal need in this codebase — every other "pick one of a few things" case so far used an inline expand or a small anchored dropdown instead. Centered overlay, closes on backdrop click or Escape. */
export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button aria-label="close" onClick={onClose} className="fixed inset-0 bg-black/50" />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-5 shadow-xl">
        {title && (
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base text-heading">{title}</h2>
            <button onClick={onClose} aria-label="close" className="shrink-0 text-dim hover:text-heading">
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
