"use client";

import { useCallback, useEffect, useState } from "react";
import { listAllCertificates } from "@/lib/firebase/certificates";
import type { Certificate } from "@/types/certificate";

export function useAdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setCertificates(await listAllCertificates());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { certificates, loading, refresh };
}
