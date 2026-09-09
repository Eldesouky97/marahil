"use client";

import { useCertificate } from "@/lib/hooks/useCertificate";
import { CertificateCard } from "./CertificateCard";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function CertificateView({ certificateId }: { certificateId: string }) {
  const { certificate, loading } = useCertificate(certificateId);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!certificate) {
    return <p className="py-24 text-center text-[#8A93A6]">لم يتم العثور على هذه الشهادة.</p>;
  }

  return (
    <section className="py-16">
      <Container size="lg" className="mx-auto max-w-md">
        <CertificateCard certificate={certificate} />
      </Container>
    </section>
  );
}
