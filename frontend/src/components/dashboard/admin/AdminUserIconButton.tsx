"use client";

import { cn } from "@/lib/utils/cn";

/** A single-icon, space-efficient action button — shared by AdminUserRow and AdminUserTableRow so approve/disable stay one-click without a full text pill eating up row width. */
export function AdminUserIconButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  tone = "default",
}: {
  icon: React.ComponentType<{ size?: number }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  tone?: "default" | "danger" | "success";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-40",
        tone === "danger" && "text-danger-ink hover:bg-danger/10",
        tone === "success" && "text-success hover:bg-success/10",
        tone === "default" && "text-dim hover:bg-surface-2 hover:text-body"
      )}
    >
      <Icon size={15} />
    </button>
  );
}
