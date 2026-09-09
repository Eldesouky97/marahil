import { VerifyResult } from "@/components/certificates/VerifyResult";

export default async function VerifyCodePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  return <VerifyResult code={code} />;
}
