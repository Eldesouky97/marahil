"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { useQrCode } from "@/lib/hooks/useQrCode";
import { getSiteUrl } from "@/lib/utils/siteUrl";
import type { Certificate } from "@/types/certificate";

export function CertificateCard({ certificate }: { certificate: Certificate }) {
  const qrDataUrl = useQrCode(`${getSiteUrl()}/verify/${certificate.verifyCode}`);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-8"
      style={{
        backgroundImage: "linear-gradient(155deg, #F6EFDD 0%, #EFE4C8 100%)",
        boxShadow: "0 20px 60px -20px rgba(212,169,79,0.35)",
      }}
    >
      <div className="pointer-events-none absolute inset-1.5 rounded-xl border-2 border-[#D4A94F]/40" />

      <div className="relative mb-8 flex items-start justify-between">
        <Logo />
        <ShieldCheck size={22} className="text-[#8A6E2F]" />
      </div>

      <p className="relative mb-1 text-[0.7rem] tracking-[0.3em] text-[#8A6E2F]">شهادة إتمام</p>
      <h2 className="relative mb-1 font-display text-2xl text-[#2B2013]">{certificate.studentName}</h2>
      <p className="relative mb-8 text-sm text-[#5B4A2A]">
        أكمل بنجاح دورة «{certificate.courseTitle}» بإشراف {certificate.teacherName}
      </p>

      <div className="relative flex items-end justify-between">
        <div className="text-[0.7rem] text-[#8A6E2F]">
          <p>الرقم التسلسلي</p>
          <p className="mt-0.5 font-mono text-[#2B2013]">{certificate.serial}</p>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-md bg-[#2B2013]/90">
          {qrDataUrl && <Image src={qrDataUrl} alt="رمز التحقق" width={44} height={44} unoptimized />}
        </div>
      </div>
    </div>
  );
}
