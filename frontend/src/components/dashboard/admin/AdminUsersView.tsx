"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/context/AuthProvider";
import { useAdminUsers } from "@/lib/hooks/useAdminUsers";
import { AdminUserRow } from "./AdminUserRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";
import { inputClasses } from "@/components/ui/FormField";

export function AdminUsersView() {
  const { profile } = useAuth();
  const { users, loading } = useAdminUsers();
  const t = useTranslations("dashboardAdmin.users");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader title={t("title")} />

        <input
          type="search"
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`${inputClasses} mb-6 max-w-sm`}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-dim">{t("noUsers")}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((u) => (
              <AdminUserRow key={u.uid} user={u} isSelf={u.uid === profile?.uid} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
