import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { PendingApprovalNotice } from "@/components/auth/PendingApprovalNotice";

export default async function PendingApprovalPage() {
  const t = await getTranslations("auth.pendingApproval");
  return (
    <AuthCard title={t("title")}>
      <PendingApprovalNotice />
    </AuthCard>
  );
}
