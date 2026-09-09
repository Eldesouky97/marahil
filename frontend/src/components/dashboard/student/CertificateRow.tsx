import Link from "next/link";
import { Award } from "lucide-react";
import type { Certificate } from "@/types/certificate";

export function CertificateRow({ certificate }: { certificate: Certificate }) {
  return (
    <Link
      href={`/certificates/${certificate.id}`}
      className="flex items-center gap-3 rounded-xl border border-[#D4A94F]/25 bg-[#D4A94F]/[0.06] p-4 transition-colors hover:border-[#D4A94F]/45"
    >
      <Award size={18} className="text-[#D4A94F]" />
      <div>
        <p className="text-sm font-medium">{certificate.courseTitle}</p>
        <p className="text-xs text-[#8A93A6]">{certificate.serial}</p>
      </div>
    </Link>
  );
}
