"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { updateUserRole, updateUserStatus, setUserDisabled, deleteUserProfile } from "@/lib/firebase/users";
import { resetPassword } from "@/lib/firebase/auth";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { PROTECTED_ADMIN_EMAIL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AppUser, UserRole, UserStatus } from "@/types/user";

const DETAIL_FIELDS: (keyof AppUser)[] = [
  "phone",
  "age",
  "governorate",
  "stage",
  "school",
  "subject",
  "workplace",
  "jobTitle",
];

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface AdminUserRowProps {
  user: AppUser;
  isSelf: boolean;
  selected: boolean;
  selectable: boolean;
  onToggleSelect: (uid: string) => void;
  onDeleted: (uid: string) => void;
}

export function AdminUserRow({ user, isSelf, selected, selectable, onToggleSelect, onDeleted }: AdminUserRowProps) {
  const { profile } = useAuth();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus | undefined>(user.status);
  const [disabled, setDisabled] = useState(user.disabled === true);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const t = useTranslations("dashboardAdmin.users");
  const tDetails = useTranslations("auth.personalDetails");

  const protectedAccount = user.email === PROTECTED_ADMIN_EMAIL;
  const locked = saving || isSelf || protectedAccount;

  async function handleRoleChange(next: UserRole) {
    setSaving(true);
    await updateUserRole(user.uid, next);
    setRole(next);
    setSaving(false);
    if (profile) await logAdminAction(profile, "roleChange", "user", user.uid, `${user.name}: ${role} -> ${next}`);
  }

  async function handleApprove() {
    setSaving(true);
    await updateUserStatus(user.uid, "approved");
    setStatus("approved");
    setSaving(false);
    if (profile) await logAdminAction(profile, "approveTeacher", "user", user.uid, user.name);
  }

  async function handleToggleDisabled() {
    const next = !disabled;
    setSaving(true);
    await setUserDisabled(user.uid, next);
    setDisabled(next);
    setSaving(false);
    if (profile) {
      await logAdminAction(profile, next ? "disableUser" : "enableUser", "user", user.uid, user.name);
    }
  }

  async function handleResetPassword() {
    setSaving(true);
    await resetPassword(user.email);
    setSaving(false);
    setResetSent(true);
    setTimeout(() => setResetSent(false), 4000);
    if (profile) await logAdminAction(profile, "passwordReset", "user", user.uid, user.name);
  }

  async function handleDelete() {
    setSaving(true);
    await deleteUserProfile(user.uid);
    if (profile) await logAdminAction(profile, "deleteUser", "user", user.uid, `${user.name} (${user.email})`);
    setSaving(false);
    onDeleted(user.uid);
  }

  const pending = role === "teacher" && !!status && status !== "approved";
  const details = DETAIL_FIELDS.filter((field) => user[field] != null && user[field] !== "");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
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
          <div className="min-w-0">
            <div className="truncate font-medium">{user.name}</div>
            <div className="truncate text-xs text-dim" dir="ltr">
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <Badge>{t(`role_${role}`)}</Badge>
          {role === "teacher" && (
            <Badge className={pending ? "border-gold/40 bg-gold/10 text-gold-strong" : ""}>
              {pending ? t("statusPending") : t("statusApproved")}
            </Badge>
          )}
          {disabled && (
            <Badge className="border-danger/40 bg-danger/10 text-danger-ink">{t("statusDisabled")}</Badge>
          )}
          {protectedAccount && <Badge className="border-gold/40 bg-gold/10 text-gold-strong">{t("protected")}</Badge>}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
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
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body disabled:opacity-50"
        >
          <option value="student">{t("role_student")}</option>
          <option value="teacher">{t("role_teacher")}</option>
          <option value="admin">{t("role_admin")}</option>
        </select>

        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />

        <Button variant="ghost" onClick={handleResetPassword} disabled={saving} className="px-3 py-1.5 text-xs text-dim">
          {resetSent ? t("resetPasswordSent") : t("resetPassword")}
        </Button>

        <Button variant="ghost" onClick={() => setShowDetails((v) => !v)} className="px-3 py-1.5 text-xs text-dim">
          {showDetails ? t("hideDetails") : t("viewDetails")}
        </Button>

        {confirmingDelete ? (
          <span className="flex items-center gap-2">
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
          </span>
        ) : (
          <Button
            variant="ghost"
            onClick={() => setConfirmingDelete(true)}
            disabled={locked}
            className="px-3 py-1.5 text-xs text-danger-ink hover:text-danger-ink"
          >
            {t("delete")}
          </Button>
        )}
      </div>

      {showDetails && (
        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-border pt-4 text-xs sm:grid-cols-2 md:grid-cols-3">
          <div>
            <dt className="text-dim">{t("joined")}</dt>
            <dd className="text-body">{new Date(user.createdAt).toLocaleDateString()}</dd>
          </div>
          {details.length === 0 ? (
            <p className="col-span-full text-dim">{t("noDetails")}</p>
          ) : (
            details.map((field) => (
              <div key={field}>
                <dt className="text-dim">{tDetails(field)}</dt>
                <dd className="text-body">{String(user[field])}</dd>
              </div>
            ))
          )}
        </dl>
      )}
    </div>
  );
}
