"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { KeyRound, MoreVertical, Trash2, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { updateUserRole, updateUserStatus, setUserDisabled, deleteUserProfile } from "@/lib/firebase/users";
import { resetPassword } from "@/lib/firebase/auth";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { useGovernorateLabel } from "@/lib/hooks/useGovernorates";
import { PROTECTED_ADMIN_EMAIL } from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { AppUser, UserRole, UserStatus } from "@/types/user";

const DETAIL_FIELDS: (keyof AppUser)[] = [
  "phone",
  "nationalId",
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

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}

function ActionsMenu({ items }: { items: MenuItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-dim transition-colors hover:bg-surface-2 hover:text-body"
        aria-label="menu"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute end-0 top-full z-20 mt-1 w-48 rounded-xl border border-border bg-surface p-1 shadow-lg">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-start text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                item.danger ? "text-danger-ink hover:bg-danger/10" : "text-body hover:bg-surface-2"
              )}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
  const governorateLabel = useGovernorateLabel();

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

  const menuItems: MenuItem[] = [
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
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body disabled:opacity-50"
          >
            <option value="student">{t("role_student")}</option>
            <option value="teacher">{t("role_teacher")}</option>
            <option value="admin">{t("role_admin")}</option>
          </select>

          <ActionsMenu items={menuItems} />
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
                <dd className="text-body" dir={field === "nationalId" || field === "phone" ? "ltr" : undefined}>
                  {field === "governorate" ? governorateLabel(String(user[field])) : String(user[field])}
                </dd>
              </div>
            ))
          )}
        </dl>
      )}
    </div>
  );
}
