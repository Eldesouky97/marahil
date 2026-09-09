import { CertificateView } from "@/components/certificates/CertificateView";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  return <CertificateView certificateId={certificateId} />;
}
