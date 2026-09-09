"use client";

import { useEffect, useState } from "react";
import { getCertificate } from "@/lib/firebase/certificates";
import type { Certificate } from "@/types/certificate";

export function useCertificate(certificateId: string) {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getCertificate(certificateId).then((data) => {
      if (!cancelled) {
        setCertificate(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [certificateId]);

  return { certificate, loading };
}
