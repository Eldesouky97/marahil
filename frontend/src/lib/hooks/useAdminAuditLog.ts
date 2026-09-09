"use client";

import { useEffect, useState } from "react";
import { listAuditLog } from "@/lib/firebase/auditLog";
import type { AuditLogEntry } from "@/types/auditLog";

export function useAdminAuditLog() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listAuditLog().then((result) => {
      setEntries(result);
      setLoading(false);
    });
  }, []);

  return { entries, loading };
}
