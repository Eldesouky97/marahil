"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CertificateEarnedBanner({ certificateId }: { certificateId: string }) {
  const t = useTranslations("lesson");
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-primary/30 bg-primary/[0.08] p-6 text-center sm:flex-row sm:justify-between sm:text-start">
      <div className="flex items-center gap-3">
        <Award size={28} className="text-primary" />
        <div>
          <p className="font-bold text-heading">{t("certificateEarnedTitle")}</p>
          <p className="text-sm text-dim">{t("certificateEarnedSubtitle")}</p>
        </div>
      </div>
      <Link href={`/certificates/${certificateId}`}>
        <Button className="px-6 py-2.5 text-sm">{t("viewCertificate")}</Button>
      </Link>
    </div>
  );
}
