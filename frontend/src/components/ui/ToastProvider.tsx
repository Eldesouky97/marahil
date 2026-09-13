"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ToastStack, type ToastItem, type ToastTone } from "./Toast";

interface ToastOptions {
  tone?: ToastTone;
  duration?: number;
}

interface ToastContextValue {
  showToast: (message: string, options?: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const showToast = useCallback(
    (message: string, options?: ToastOptions) => {
      const id = crypto.randomUUID();
      const tone = options?.tone ?? "info";
      setToasts((prev) => [...prev, { id, message, tone }]);
      const timer = setTimeout(() => dismiss(id), options?.duration ?? DEFAULT_DURATION);
      timers.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
