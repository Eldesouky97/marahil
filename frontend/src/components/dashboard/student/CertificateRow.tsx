import { Link } from "@/i18n/navigation";
import { Award } from "lucide-react";
import type { Certificate } from "@/types/certificate";

export function CertificateRow({ certificate }: { certificate: Certificate }) {
  return (
    <Link
      href={`/certificates/${certificate.id}`}
      className="flex items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] p-4 transition-colors hover:border-primary/45"
    >
      <Award size={18} className="text-primary" />
      <div>
        <p className="text-sm font-medium">{certificate.courseTitle}</p>
        <p className="text-xs text-dim">{certificate.serial}</p>
      </div>
    </Link>
  );
}
