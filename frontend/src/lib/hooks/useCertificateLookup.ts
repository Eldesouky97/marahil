"use client";

import { useEffect, useState } from "react";
import { findCertificateByCode } from "@/lib/firebase/certificates";
import type { Certificate } from "@/types/certificate";

export function useCertificateLookup(code: string) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    findCertificateByCode(code).then((data) => {
      if (!cancelled) {
        setCertificate(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [code]);

  return { certificate, loading };
}
