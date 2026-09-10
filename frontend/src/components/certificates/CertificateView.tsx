"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import confetti from "canvas-confetti";
import { useCertificate } from "@/lib/hooks/useCertificate";
import { CertificateCard } from "./CertificateCard";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function CertificateView({ certificateId }: { certificateId: string }) {
  const { certificate, loading } = useCertificate(certificateId);
  const t = useTranslations("certificates");
  const celebrated = useRef(false);

  useEffect(() => {
    if (!certificate || celebrated.current) return;
    celebrated.current = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const style = getComputedStyle(document.documentElement);
    const colors = [style.getPropertyValue("--gold"), style.getPropertyValue("--accent"), style.getPropertyValue("--primary")]
      .map((c) => c.trim())
      .filter(Boolean);

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors, startVelocity: 45 });
  }, [certificate]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!certificate) {
    return <p className="py-24 text-center text-dim">{t("notFound")}</p>;
  }

  return (
    <section className="py-16">
      <Container size="lg" className="mx-auto max-w-md">
        <CertificateCard certificate={certificate} />
      </Container>
    </section>
  );
}
