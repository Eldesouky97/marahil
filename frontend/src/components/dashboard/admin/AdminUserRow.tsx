"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { updateUserRole, updateUserStatus, setUserDisabled } from "@/lib/firebase/users";
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

export function AdminUserRow({ user, isSelf }: { user: AppUser; isSelf: boolean }) {
  const { profile } = useAuth();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus | undefined>(user.status);
  const [disabled, setDisabled] = useState(user.disabled === true);
  const [saving, setSaving] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
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

  const pending = role === "teacher" && !!status && status !== "approved";
  const details = DETAIL_FIELDS.filter((field) => user[field] != null && user[field] !== "");

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium">{user.name}</div>
          <div className="mt-1 text-xs text-dim" dir="ltr">
            {user.email}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
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

          <Button variant="ghost" onClick={() => setShowDetails((v) => !v)} className="px-3 py-1.5 text-xs">
            {showDetails ? t("hideDetails") : t("viewDetails")}
          </Button>
        </div>
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
