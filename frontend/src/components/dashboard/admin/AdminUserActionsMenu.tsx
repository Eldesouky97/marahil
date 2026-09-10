"use client";

import { useEffect, useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface AdminUserMenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

/** Shared by AdminUserRow (mobile card) and AdminUserTableRow (desktop table) — a small local dropdown, not a `ui/` primitive since nothing else needs one yet. */
export function AdminUserActionsMenu({ items }: { items: AdminUserMenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-dim transition-colors hover:bg-surface-2 hover:text-body"
        aria-label="menu"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute end-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-surface p-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                item.danger ? "text-danger-ink hover:bg-danger/10" : "text-body hover:bg-surface-2"
              )}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
