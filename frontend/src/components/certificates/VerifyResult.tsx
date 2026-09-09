"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { useCertificateLookup } from "@/lib/hooks/useCertificateLookup";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function VerifyResult({ code }: { code: string }) {
  const { certificate, loading } = useCertificateLookup(code);

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
            <CheckCircle2 size={40} className="mx-auto mb-5 text-[#3FBFAE]" />
            <h1 className="mb-2 font-display text-xl text-[#F6EFDD]">شهادة موثّقة وصحيحة</h1>
            <p className="mb-6 text-sm text-[#8A93A6]">رمز التحقق: {certificate.verifyCode}</p>
            <div className="rounded-xl border border-white/10 bg-[#0F1729] p-6 text-right">
              <p className="mb-1 text-xs text-[#5C6584]">الطالب</p>
              <p className="mb-4 font-bold">{certificate.studentName}</p>
              <p className="mb-1 text-xs text-[#5C6584]">الدورة</p>
              <p className="mb-4 font-bold">{certificate.courseTitle}</p>
              <p className="mb-1 text-xs text-[#5C6584]">المعلّم</p>
              <p className="font-bold">{certificate.teacherName}</p>
            </div>
          </>
        ) : (
          <>
            <XCircle size={40} className="mx-auto mb-5 text-[#E86B6B]" />
            <h1 className="mb-2 font-display text-xl text-[#F6EFDD]">لم يتم العثور على شهادة</h1>
            <p className="text-sm text-[#8A93A6]">تأكد من رمز التحقق وحاول مرة أخرى.</p>
          </>
        )}
      </Container>
    </section>
  );
}
