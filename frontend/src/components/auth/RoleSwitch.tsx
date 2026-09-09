"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types/user";

export function RoleSwitch({ value, onChange }: { value: UserRole; onChange: (role: UserRole) => void }) {
  const t = useTranslations("auth.register");
  const options: { role: UserRole; label: string }[] = [
    { role: "student", label: t("roleStudent") },
    { role: "teacher", label: t("roleTeacher") },
  ];

  return (
    <div className="grid grid-cols-2 gap-2 rounded-lg border border-border bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.role}
          type="button"
          onClick={() => onChange(o.role)}
          className={cn(
            "cursor-pointer rounded-md py-2 text-sm transition-colors",
            value === o.role ? "bg-gradient-to-l from-primary to-primary-strong text-primary-ink" : "text-dim"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
