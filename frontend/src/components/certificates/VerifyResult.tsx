"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { useCertificateLookup } from "@/lib/hooks/useCertificateLookup";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function VerifyResult({ code }: { code: string }) {
  const { certificate, loading } = useCertificateLookup(code);
  const t = useTranslations("verify");

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return (
    <section className="py-20">
      <Container size="lg" className="mx-auto max-w-md text-center">
        {certificate ? (
          <>
            <CheckCircle2 size={40} className="mx-auto mb-5 text-accent" />
            <h1 className="mb-2 font-display text-xl text-heading">{t("validTitle")}</h1>
            <p className="mb-6 text-sm text-dim">{t("codeLabel", { code: certificate.verifyCode })}</p>
            <div className="rounded-xl border border-border bg-surface-2 p-6 text-start">
              <p className="mb-1 text-xs text-faint">{t("studentLabel")}</p>
              <p className="mb-4 font-bold">{certificate.studentName}</p>
              <p className="mb-1 text-xs text-faint">{t("courseLabel")}</p>
              <p className="mb-4 font-bold">{certificate.courseTitle}</p>
              <p className="mb-1 text-xs text-faint">{t("teacherLabel")}</p>
              <p className="font-bold">{certificate.teacherName}</p>
            </div>
          </>
        ) : (
          <>
            <XCircle size={40} className="mx-auto mb-5 text-danger" />
            <h1 className="mb-2 font-display text-xl text-heading">{t("invalidTitle")}</h1>
            <p className="text-sm text-dim">{t("invalidDescription")}</p>
          </>
        )}
      </Container>
    </section>
  );
}
