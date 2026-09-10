import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { AccountDisabledNotice } from "@/components/auth/AccountDisabledNotice";

export default async function AccountDisabledPage() {
  const t = await getTranslations("auth.accountDisabled");
  return (
    <AuthCard title={t("title")}>
      <AccountDisabledNotice />
    </AuthCard>
  );
}
