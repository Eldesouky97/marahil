"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { updateUserRole, updateUserStatus } from "@/lib/firebase/users";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { AppUser, UserRole, UserStatus } from "@/types/user";

export function AdminUserRow({ user, isSelf }: { user: AppUser; isSelf: boolean }) {
  const { profile } = useAuth();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus | undefined>(user.status);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("dashboardAdmin.users");

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

  const pending = role === "teacher" && !!status && status !== "approved";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
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
        {pending && (
          <Button variant="outline" onClick={handleApprove} disabled={saving} className="px-4 py-1.5 text-xs">
            {t("approve")}
          </Button>
        )}
        <select
          value={role}
          disabled={saving || isSelf}
          onChange={(e) => handleRoleChange(e.target.value as UserRole)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body disabled:opacity-50"
        >
          <option value="student">{t("role_student")}</option>
          <option value="teacher">{t("role_teacher")}</option>
          <option value="admin">{t("role_admin")}</option>
        </select>
      </div>
    </div>
  );
}
