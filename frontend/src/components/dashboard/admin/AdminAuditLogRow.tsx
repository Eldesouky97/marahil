"use client";

import { useTranslations } from "next-intl";
import type { AuditLogEntry } from "@/types/auditLog";

export function AdminAuditLogRow({ entry }: { entry: AuditLogEntry }) {
  const t = useTranslations("dashboardAdmin.auditLog");

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-surface p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <span className="font-medium">{entry.adminName}</span>
        <span className="text-dim"> — {t(`action_${entry.action}`)}</span>
        {entry.details && <span className="text-dim"> ({entry.details})</span>}
      </div>
      <span className="text-xs text-faint" dir="ltr">
        {new Date(entry.createdAt).toLocaleString()}
      </span>
    </div>
  );
}
