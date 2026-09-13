"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ToastTone = "success" | "error" | "info";

export interface ToastItem {
  id: string;
  message: string;
  tone: ToastTone;
}

const TONE_ICON: Record<ToastTone, typeof CheckCircle2> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const TONE_CLASSES: Record<ToastTone, string> = {
  success: "border-s-4 border-s-success text-success",
  error: "border-s-4 border-s-danger text-danger",
  info: "border-s-4 border-s-primary text-primary",
};

export function ToastStack({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  const reduceMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div className="fixed bottom-4 end-4 z-70 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = TONE_ICON[toast.tone];
          return (
            <motion.div
              key={toast.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              className={cn(
                "flex max-w-xs items-start gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-sm text-body shadow-[0_16px_32px_-12px_rgba(0,0,0,0.18)]",
                TONE_CLASSES[toast.tone]
              )}
            >
              <Icon size={17} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-body">{toast.message}</p>
              <button
                onClick={() => onDismiss(toast.id)}
                aria-label="close"
                className="shrink-0 text-faint transition-colors hover:text-body"
              >
                <X size={15} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
