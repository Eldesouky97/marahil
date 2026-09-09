import Link from "next/link";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CertificateEarnedBanner({ certificateId }: { certificateId: string }) {
  return (
    <div className="mt-6 flex flex-col items-center gap-4 rounded-xl border border-[#D4A94F]/30 bg-[#D4A94F]/[0.08] p-6 text-center sm:flex-row sm:justify-between sm:text-right">
      <div className="flex items-center gap-3">
        <Award size={28} className="text-[#D4A94F]" />
        <div>
          <p className="font-bold text-[#F6EFDD]">مبروك! أكملت الدورة</p>
          <p className="text-sm text-[#8A93A6]">شهادتك جاهزة الآن للتحميل والمشاركة.</p>
        </div>
      </div>
      <Link href={`/certificates/${certificateId}`}>
        <Button className="px-6 py-2.5 text-sm">عرض الشهادة</Button>
      </Link>
    </div>
  );
}
