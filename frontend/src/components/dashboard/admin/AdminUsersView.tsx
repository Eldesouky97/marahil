"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Search, UserPlus, Users as UsersIcon } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useAdminUsers } from "@/lib/hooks/useAdminUsers";
import { setUserDisabled } from "@/lib/firebase/users";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { downloadExcel } from "@/lib/utils/exportExcel";
import { useGovernorateLabel } from "@/lib/hooks/useGovernorates";
import { PROTECTED_ADMIN_EMAIL } from "@/lib/constants";
import { AdminUserRow } from "./AdminUserRow";
import { AdminUserTableRow } from "./AdminUserTableRow";
import { AdminAddUserForm } from "./AdminAddUserForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { AppUser, UserRole } from "@/types/user";

type RoleFilter = "all" | UserRole;
type StatusFilter = "all" | "pending" | "approved" | "disabled";
type SortKey = "newest" | "oldest" | "name";

const pillSelectClasses =
  "rounded-full border border-border bg-bg px-3 py-1.5 text-xs text-body outline-none focus:border-accent/50";

export function AdminUsersView() {
  const { profile } = useAuth();
  const { users, loading, refresh } = useAdminUsers();
  const t = useTranslations("dashboardAdmin.users");
  const tDetails = useTranslations("auth.personalDetails");
  const governorateLabel = useGovernorateLabel();
  const initialQuery = useSearchParams().get("q") ?? "";
  const [search, setSearch] = useState(initialQuery);
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortKey, setSortKey] = useState<SortKey>("newest");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [listVersion, setListVersion] = useState(0);
  const [bulkSaving, setBulkSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users
      .filter((u) => !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .filter((u) => roleFilter === "all" || u.role === roleFilter)
      .filter((u) => {
        if (statusFilter === "all") return true;
        if (statusFilter === "disabled") return u.disabled === true;
        if (u.disabled === true) return false;
        return statusFilter === "pending" ? !!u.status && u.status !== "approved" : u.status !== "pending";
      })
      .sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        return sortKey === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt;
      });
  }, [users, search, roleFilter, statusFilter, sortKey]);

  const selectableIds = useMemo(
    () => filtered.filter((u) => u.uid !== profile?.uid && u.email !== PROTECTED_ADMIN_EMAIL).map((u) => u.uid),
    [filtered, profile]
  );
  const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selected.has(id));

  function toggleSelect(uid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelected(allSelected ? new Set() : new Set(selectableIds));
  }

  async function handleBulkDisable(disabled: boolean) {
    const targets = users.filter((u) => selected.has(u.uid));
    if (targets.length === 0) return;
    setBulkSaving(true);
    await Promise.all(targets.map((u) => setUserDisabled(u.uid, disabled)));
    if (profile) {
      await logAdminAction(
        profile,
        disabled ? "bulkDisableUsers" : "bulkEnableUsers",
        "user",
        "bulk",
        targets.map((u) => u.name).join(", ")
      );
    }
    setSelected(new Set());
    setBulkSaving(false);
    await refresh();
    setListVersion((v) => v + 1);
  }

  async function handleUserDeleted(uid: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(uid);
      return next;
    });
    await refresh();
    setListVersion((v) => v + 1);
  }

  async function handleUserAdded() {
    setShowAddForm(false);
    await refresh();
    setListVersion((v) => v + 1);
  }

  function handleExportExcel() {
    const headers = [
      t("colName"),
      t("colEmail"),
      t("colRole"),
      t("colStatus"),
      t("colDisabled"),
      t("joined"),
      tDetails("phone"),
      tDetails("nationalId"),
      tDetails("age"),
      tDetails("governorate"),
      tDetails("school"),
      tDetails("subject"),
      tDetails("workplace"),
      tDetails("jobTitle"),
    ];
    const rows = filtered.map((u: AppUser) => [
      u.name,
      u.email,
      t(`role_${u.role}`),
      u.status ?? "",
      u.disabled ? t("yes") : t("no"),
      new Date(u.createdAt).toLocaleDateString(),
      u.phone ?? "",
      u.nationalId ?? "",
      u.age ?? "",
      u.governorate ? governorateLabel(u.governorate) : "",
      u.school ?? "",
      u.subject ?? "",
      u.workplace ?? "",
      u.jobTitle ?? "",
    ]);
    downloadExcel(`marahil-users-${Date.now()}.xlsx`, headers, rows);
  }

  return (
    <>
      <DashboardHeader
        title={t("title")}
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel} className="px-4 py-2 text-xs">
              {t("exportExcel")}
            </Button>
            <Button onClick={() => setShowAddForm((v) => !v)} className="gap-1.5 px-4 py-2 text-xs">
              <UserPlus size={14} />
              {t("addUser")}
            </Button>
          </div>
        }
      />

      {showAddForm && <AdminAddUserForm onCreated={handleUserAdded} onCancel={() => setShowAddForm(false)} />}

      <div className="mb-6 flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-surface p-2.5">
        <div className="relative min-w-35 flex-1">
          <Search size={13} className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-faint start-3" />
          <input
            type="search"
            aria-label={t("searchPlaceholder")}
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-border bg-bg py-1.5 text-xs text-body placeholder:text-faint outline-none ps-8 pe-3 focus:border-accent/50"
          />
        </div>

        <select
          aria-label={t("colRole")}
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
          className={pillSelectClasses}
        >
          <option value="all">{t("filterAllRoles")}</option>
          <option value="student">{t("role_student")}</option>
          <option value="teacher">{t("role_teacher")}</option>
          <option value="admin">{t("role_admin")}</option>
        </select>

        <select
          aria-label={t("colStatus")}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className={pillSelectClasses}
        >
          <option value="all">{t("filterAllStatuses")}</option>
          <option value="pending">{t("statusPending")}</option>
          <option value="approved">{t("statusApproved")}</option>
          <option value="disabled">{t("statusDisabled")}</option>
        </select>

        <select
          aria-label={t("sortNewest")}
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className={pillSelectClasses}
        >
          <option value="newest">{t("sortNewest")}</option>
          <option value="oldest">{t("sortOldest")}</option>
          <option value="name">{t("sortNameAsc")}</option>
        </select>

        <span className="ms-auto flex items-center gap-1.5 whitespace-nowrap ps-2 text-xs text-dim">
          <UsersIcon size={12} className="text-faint" />
          {t("resultsCount", { count: filtered.length })}
        </span>
      </div>

      {selectableIds.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-surface-2 px-5 py-3.5">
          <label className="flex items-center gap-2 text-xs font-medium text-body">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="h-4 w-4" />
            {t("selectAll")}
          </label>
          {selected.size > 0 && (
            <>
              <Badge className="border-primary/30 bg-primary/10 text-primary-strong">
                {t("selectedCount", { count: selected.size })}
              </Badge>
              <div className="ms-auto flex gap-2">
                <Button
                  variant="outline"
                  disabled={bulkSaving}
                  onClick={() => handleBulkDisable(true)}
                  className="border-danger/40 px-4 py-1.5 text-xs text-danger-ink hover:border-danger/60"
                >
                  {t("bulkDisable")}
                </Button>
                <Button variant="outline" disabled={bulkSaving} onClick={() => handleBulkDisable(false)} className="px-4 py-1.5 text-xs">
                  {t("bulkEnable")}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <UsersIcon size={28} className="text-faint" />
          <p className="text-dim">{t("noUsers")}</p>
        </div>
      ) : (
        <>
          {/* Desktop: a real table — much easier to scan a long user list than a stack of cards. */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
            <table className="w-full border-collapse text-start">
              <thead className="border-b border-border bg-surface-2 text-xs font-medium text-dim">
                <tr>
                  <th className="w-10 px-3 py-3">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      disabled={selectableIds.length === 0}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 disabled:opacity-30"
                      aria-label={t("selectAll")}
                    />
                  </th>
                  <th className="px-3 py-3 text-start">{t("colName")}</th>
                  <th className="px-3 py-3 text-start">{t("colRole")}</th>
                  <th className="px-3 py-3 text-start">{t("colStatus")}</th>
                  <th className="hidden px-3 py-3 text-start lg:table-cell">{t("joined")}</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => (
                  <AdminUserTableRow
                    key={`${u.uid}:${listVersion}`}
                    user={u}
                    selected={selected.has(u.uid)}
                    selectable={selectableIds.includes(u.uid)}
                    onToggleSelect={toggleSelect}
                    onDeleted={handleUserDeleted}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards — a table doesn't fit a narrow screen. */}
          <div className="space-y-3 md:hidden">
            {filtered.map((u) => (
              <AdminUserRow
                key={`${u.uid}:${listVersion}`}
                user={u}
                selected={selected.has(u.uid)}
                selectable={selectableIds.includes(u.uid)}
                onToggleSelect={toggleSelect}
                onDeleted={handleUserDeleted}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
}
