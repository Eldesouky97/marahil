"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useQrCode } from "@/lib/hooks/useQrCode";
import { getSiteUrl } from "@/lib/utils/siteUrl";
import type { Certificate } from "@/types/certificate";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const qrDataUrl = useQrCode(`${getSiteUrl()}/verify/${certificate.verifyCode}`);
  const t = useTranslations("certificates");

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8"
      style={{
        backgroundImage: "linear-gradient(155deg, var(--surface) 0%, var(--bg-alt) 100%)",
        boxShadow: "0 20px 60px -20px color-mix(in srgb, var(--gold) 35%, transparent)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
        style={{ backgroundImage: "linear-gradient(90deg, var(--primary) 0%, var(--accent) 60%, var(--gold) 100%)" }}
      />
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border-2 border-gold/40" />

      <div className="relative mb-8 flex items-start justify-between">
        <Logo size={56} />
        <ShieldCheck size={22} className="text-gold-strong" />
      </div>

      <p className="relative mb-1 text-[0.7rem] tracking-[0.3em] text-accent-strong">{t("completionLabel")}</p>
      <h2 className="relative mb-1 font-display text-2xl text-heading">{certificate.studentName}</h2>
      <p className="relative mb-8 text-sm text-body">
        {t("completedText", { course: certificate.courseTitle, teacher: certificate.teacherName })}
      </p>

      <div className="relative flex items-end justify-between">
        <div className="text-[0.7rem] text-muted">
          <p>{t("serialLabel")}</p>
          <p className="mt-0.5 font-mono text-heading">{certificate.serial}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/90">
          {qrDataUrl && <Image src={qrDataUrl} alt={t("qrAlt")} width={44} height={44} unoptimized />}
        </div>
      </div>
    </div>
  );
}
