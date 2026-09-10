"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { createUserByAdmin } from "@/lib/firebase/auth";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { UserRole } from "@/types/user";

export function AdminAddUserForm({ onCreated, onCancel }: { onCreated: () => void; onCancel: () => void }) {
  const { profile } = useAuth();
  const t = useTranslations("dashboardAdmin.users");
  const tRegister = useTranslations("auth.register");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const uid = await createUserByAdmin({ name, email, password, role });
      if (profile) await logAdminAction(profile, "createUser", "user", uid, `${name} (${email}): ${role}`);
      onCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "";
      if (message.includes("EMAIL_EXISTS")) setError(t("addUserErrorEmailExists"));
      else if (message.includes("WEAK_PASSWORD")) setError(t("addUserErrorWeakPassword"));
      else if (message.includes("INVALID_EMAIL")) setError(t("addUserErrorInvalidEmail"));
      else setError(t("addUserError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4 rounded-2xl border border-border bg-surface-2 p-5">
      <h3 className="text-sm font-bold text-heading">{t("addUser")}</h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={tRegister("name")}>
          <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>
        <FormField label={tRegister("email")}>
          <input
            type="email"
            required
            dir="ltr"
            className={inputClasses}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormField>
        <FormField label={tRegister("password")}>
          <input
            type="password"
            required
            minLength={6}
            dir="ltr"
            className={inputClasses}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormField>
        <FormField label={t("colRole")}>
          <select className={inputClasses} value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
            <option value="student">{t("role_student")}</option>
            <option value="teacher">{t("role_teacher")}</option>
            <option value="admin">{t("role_admin")}</option>
          </select>
        </FormField>
      </div>

      {error && <p className="text-sm text-danger-ink">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="px-5 py-2 text-sm">
          {saving ? t("addUserSaving") : t("addUserSubmit")}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel} className="px-5 py-2 text-sm">
          {t("cancel")}
        </Button>
      </div>
    </form>
  );
}
