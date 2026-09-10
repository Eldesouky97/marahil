"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { updateUserRole, updateUserStatus, setUserDisabled, deleteUserProfile } from "@/lib/firebase/users";
import { resetPassword } from "@/lib/firebase/auth";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { PROTECTED_ADMIN_EMAIL } from "@/lib/constants";
import type { AppUser, UserRole, UserStatus } from "@/types/user";

/**
 * The state + handlers behind one admin user row — shared by AdminUserRow
 * (mobile card) and AdminUserTableRow (desktop `<tr>`) so the two
 * presentations of the same row never drift on what each action actually
 * does. Each row still owns its own instance (role/status/disabled as local
 * `useState`, seeded once from `user` at mount) — see AdminUsersView's
 * `listVersion` remount key for why a parent-triggered refetch alone
 * doesn't resync that local state.
 */
export function useAdminUserRowActions(user: AppUser, onDeleted: (uid: string) => void) {
  const { profile } = useAuth();
  const [role, setRole] = useState<UserRole>(user.role);
  const [status, setStatus] = useState<UserStatus | undefined>(user.status);
  const [disabled, setDisabled] = useState(user.disabled === true);
  const [saving, setSaving] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const protectedAccount = user.email === PROTECTED_ADMIN_EMAIL;
  const isSelf = profile?.uid === user.uid;
  const locked = saving || isSelf || protectedAccount;
  const pending = role === "teacher" && !!status && status !== "approved";

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
    if (profile) await logAdminAction(profile, next ? "disableUser" : "enableUser", "user", user.uid, user.name);
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

  return {
    role,
    status,
    disabled,
    saving,
    resetSent,
    confirmingDelete,
    setConfirmingDelete,
    protectedAccount,
    isSelf,
    locked,
    pending,
    handleRoleChange,
    handleApprove,
    handleToggleDisabled,
    handleResetPassword,
    handleDelete,
  };
}
