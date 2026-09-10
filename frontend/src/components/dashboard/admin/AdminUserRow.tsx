"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, Trash2, UserRound } from "lucide-react";
import { useAdminUserRowActions } from "@/lib/hooks/useAdminUserRowActions";
import { initials } from "@/lib/utils/initials";
import { AdminUserActionsMenu, type AdminUserMenuItem } from "./AdminUserActionsMenu";
import { AdminUserDetails } from "./AdminUserDetails";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AppUser } from "@/types/user";

interface AdminUserRowProps {
  user: AppUser;
  selected: boolean;
  selectable: boolean;
  onToggleSelect: (uid: string) => void;
  onDeleted: (uid: string) => void;
}

/** The mobile card presentation of a user row — see AdminUserTableRow for the desktop `<tr>` version; both share useAdminUserRowActions. */
export function AdminUserRow({ user, selected, selectable, onToggleSelect, onDeleted }: AdminUserRowProps) {
  const [showDetails, setShowDetails] = useState(false);
  const t = useTranslations("dashboardAdmin.users");
  const {
    role,
    disabled,
    saving,
    resetSent,
    confirmingDelete,
    setConfirmingDelete,
    protectedAccount,
    locked,
    pending,
    handleRoleChange,
    handleApprove,
    handleToggleDisabled,
    handleResetPassword,
    handleDelete,
  } = useAdminUserRowActions(user, onDeleted);

  const menuItems: AdminUserMenuItem[] = [
    {
      label: resetSent ? t("resetPasswordSent") : t("resetPassword"),
      icon: KeyRound,
      onClick: handleResetPassword,
      disabled: saving,
    },
    { label: showDetails ? t("hideDetails") : t("viewDetails"), icon: UserRound, onClick: () => setShowDetails((v) => !v) },
    { label: t("delete"), icon: Trash2, onClick: () => setConfirmingDelete(true), disabled: locked, danger: true },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/20">
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="checkbox"
          checked={selected}
          disabled={!selectable}
          onChange={() => onToggleSelect(user.uid)}
          className="h-4 w-4 shrink-0 disabled:opacity-30"
          aria-label={t("selectUser")}
        />
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-xs font-bold text-heading">
          {initials(user.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate font-medium">{user.name}</span>
            <Badge>{t(`role_${role}`)}</Badge>
            {role === "teacher" && (
              <Badge className={pending ? "border-gold/40 bg-gold/10 text-gold-strong" : ""}>
                {pending ? t("statusPending") : t("statusApproved")}
              </Badge>
            )}
            {disabled && <Badge className="border-danger/40 bg-danger/10 text-danger-ink">{t("statusDisabled")}</Badge>}
            {protectedAccount && <Badge className="border-gold/40 bg-gold/10 text-gold-strong">{t("protected")}</Badge>}
          </div>
          <div className="truncate text-xs text-dim" dir="ltr">
            {user.email}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {pending && (
            <Button variant="outline" onClick={handleApprove} disabled={saving} className="px-4 py-1.5 text-xs">
              {t("approve")}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={handleToggleDisabled}
            disabled={locked}
            className={`px-4 py-1.5 text-xs ${disabled ? "" : "border-danger/40 text-danger-ink hover:border-danger/60 hover:text-danger-ink"}`}
          >
            {disabled ? t("enable") : t("disable")}
          </Button>

          <select
            value={role}
            disabled={locked}
            onChange={(e) => handleRoleChange(e.target.value as AppUser["role"])}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body disabled:opacity-50"
          >
            <option value="student">{t("role_student")}</option>
            <option value="teacher">{t("role_teacher")}</option>
            <option value="admin">{t("role_admin")}</option>
          </select>

          <AdminUserActionsMenu items={menuItems} />
        </div>
      </div>

      {confirmingDelete && (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5">
          <span className="text-xs text-danger-ink">{t("confirmDelete")}</span>
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={saving}
            className="border-danger/40 px-3 py-1.5 text-xs text-danger-ink hover:border-danger/60"
          >
            {t("confirmDeleteYes")}
          </Button>
          <Button variant="ghost" onClick={() => setConfirmingDelete(false)} className="px-3 py-1.5 text-xs">
            {t("cancel")}
          </Button>
        </div>
      )}

      {showDetails && (
        <div className="mt-4 border-t border-border pt-4">
          <AdminUserDetails user={user} />
        </div>
      )}
    </div>
  );
}
