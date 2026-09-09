"use client";

import { useTranslations } from "next-intl";
import { useCertificate } from "@/lib/hooks/useCertificate";
import { CertificateCard } from "./CertificateCard";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function CertificateView({ certificateId }: { certificateId: string }) {
  const { certificate, loading } = useCertificate(certificateId);
  const t = useTranslations("certificates");

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
