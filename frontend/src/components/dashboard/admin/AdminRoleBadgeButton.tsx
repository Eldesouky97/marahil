"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import type { UserRole } from "@/types/user";

const ROLES: UserRole[] = ["student", "teacher", "admin"];

/**
 * The role Badge itself is the trigger — click it, a screen opens to pick a
 * new role from. Replaces the old inline `<select>` (took up row width) and
 * the brief "role change as menu items" version (buried the action next to
 * unrelated ones); shared by AdminUserRow and AdminUserTableRow.
 */
export function AdminRoleBadgeButton({
  role,
  disabled,
  onChange,
}: {
  role: UserRole;
  disabled: boolean;
  onChange: (role: UserRole) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("dashboardAdmin.users");

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Badge className={cn("transition-colors", !disabled && "cursor-pointer hover:border-primary/40")}>
          {t(`role_${role}`)}
        </Badge>
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t("changeRoleTitle")}>
        <div className="space-y-1.5">
          {ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                onChange(r);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors",
                r === role
                  ? "border-primary/40 bg-primary/10 text-primary-strong"
                  : "border-border hover:border-primary/30 hover:bg-surface-2"
              )}
            >
              {t(`role_${r}`)}
              {r === role && <Check size={16} />}
            </button>
          ))}
        </div>
      </Modal>
    </>
  );
}
