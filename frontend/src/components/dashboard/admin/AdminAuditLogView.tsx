"use client";

import { useTranslations } from "next-intl";
import { useAdminAuditLog } from "@/lib/hooks/useAdminAuditLog";
import { AdminAuditLogRow } from "./AdminAuditLogRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function AdminAuditLogView() {
  const { entries, loading } = useAdminAuditLog();
  const t = useTranslations("dashboardAdmin.auditLog");

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader title={t("title")} />

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : entries.length === 0 ? (
          <p className="text-dim">{t("noEntries")}</p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <AdminAuditLogRow key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
