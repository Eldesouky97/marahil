"use client";

import { Fragment, useState } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, Trash2, UserRound } from "lucide-react";
import { useAdminUserRowActions } from "@/lib/hooks/useAdminUserRowActions";
import { initials } from "@/lib/utils/initials";
import { AdminUserActionsMenu, type AdminUserMenuItem } from "./AdminUserActionsMenu";
import { AdminUserDetails } from "./AdminUserDetails";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AppUser } from "@/types/user";

interface AdminUserTableRowProps {
  user: AppUser;
  selected: boolean;
  selectable: boolean;
  onToggleSelect: (uid: string) => void;
  onDeleted: (uid: string) => void;
}

/** The desktop `<table>` presentation of a user row — see AdminUserRow for the mobile card version; both share useAdminUserRowActions. */
export function AdminUserTableRow({ user, selected, selectable, onToggleSelect, onDeleted }: AdminUserTableRowProps) {
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
    <Fragment>
      <tr className="border-b border-border transition-colors last:border-0 hover:bg-surface-2">
        <td className="w-10 px-3 py-3">
          <input
            type="checkbox"
            checked={selected}
            disabled={!selectable}
            onChange={() => onToggleSelect(user.uid)}
            className="h-4 w-4 disabled:opacity-30"
            aria-label={t("selectUser")}
          />
        </td>

        <td className="px-3 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-surface-2 text-xs font-bold text-heading">
              {initials(user.name)}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-medium">{user.name}</div>
              <div className="truncate text-xs text-dim" dir="ltr">
                {user.email}
              </div>
            </div>
          </div>
        </td>

        <td className="px-3 py-3">
          <select
            value={role}
            disabled={locked}
            onChange={(e) => handleRoleChange(e.target.value as AppUser["role"])}
            className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-body disabled:opacity-50"
          >
            <option value="student">{t("role_student")}</option>
            <option value="teacher">{t("role_teacher")}</option>
            <option value="admin">{t("role_admin")}</option>
          </select>
        </td>

        <td className="px-3 py-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {role === "teacher" && (
              <Badge className={pending ? "border-gold/40 bg-gold/10 text-gold-strong" : ""}>
                {pending ? t("statusPending") : t("statusApproved")}
              </Badge>
            )}
            {disabled && <Badge className="border-danger/40 bg-danger/10 text-danger-ink">{t("statusDisabled")}</Badge>}
            {protectedAccount && <Badge className="border-gold/40 bg-gold/10 text-gold-strong">{t("protected")}</Badge>}
          </div>
        </td>

        <td className="px-3 py-3 text-xs text-dim">{new Date(user.createdAt).toLocaleDateString()}</td>

        <td className="px-3 py-3">
          <div className="flex items-center justify-end gap-2">
            {pending && (
              <Button variant="outline" onClick={handleApprove} disabled={saving} className="px-3 py-1.5 text-xs">
                {t("approve")}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleToggleDisabled}
              disabled={locked}
              className={`px-3 py-1.5 text-xs ${disabled ? "" : "border-danger/40 text-danger-ink hover:border-danger/60 hover:text-danger-ink"}`}
            >
              {disabled ? t("enable") : t("disable")}
            </Button>
            <AdminUserActionsMenu items={menuItems} />
          </div>
        </td>
      </tr>

      {confirmingDelete && (
        <tr className="border-b border-border last:border-0">
          <td colSpan={6} className="px-3 py-3">
            <div className="flex items-center gap-3 rounded-xl border border-danger/30 bg-danger/5 px-4 py-2.5">
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
          </td>
        </tr>
      )}

      {showDetails && (
        <tr className="border-b border-border bg-surface-2/50 last:border-0">
          <td colSpan={6} className="px-6 py-4">
            <AdminUserDetails user={user} />
          </td>
        </tr>
      )}
    </Fragment>
  );
}
