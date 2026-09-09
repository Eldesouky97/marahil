"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateUserRole } from "@/lib/firebase/users";
import { Badge } from "@/components/ui/Badge";
import type { AppUser, UserRole } from "@/types/user";

export function AdminUserRow({ user, isSelf }: { user: AppUser; isSelf: boolean }) {
  const [role, setRole] = useState<UserRole>(user.role);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("dashboardAdmin.users");

  async function handleChange(next: UserRole) {
    setSaving(true);
    await updateUserRole(user.uid, next);
    setRole(next);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="mt-1 text-xs text-dim" dir="ltr">
          {user.email}
        </div>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto">
        <Badge>{t(`role_${role}`)}</Badge>
        <select
          value={role}
          disabled={saving || isSelf}
          onChange={(e) => handleChange(e.target.value as UserRole)}
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
