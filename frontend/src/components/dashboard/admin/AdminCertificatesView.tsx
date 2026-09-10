"use client";

import { useTranslations } from "next-intl";
import { useAdminCertificates } from "@/lib/hooks/useAdminCertificates";
import { AdminCertificateRow } from "./AdminCertificateRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";

export function AdminCertificatesView() {
  const { certificates, loading, refresh } = useAdminCertificates();
  const t = useTranslations("dashboardAdmin.certificates");

  return (
    <>
      <DashboardHeader title={t("title")} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : certificates.length === 0 ? (
        <p className="text-dim">{t("noCertificates")}</p>
      ) : (
        <div className="space-y-3">
          {certificates.map((c) => (
            <AdminCertificateRow key={c.id} certificate={c} onChanged={refresh} />
          ))}
        </div>
      )}
    </>
  );
}
