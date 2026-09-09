import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { CompleteProfileForm } from "@/components/auth/CompleteProfileForm";

export default async function CompleteProfilePage() {
  const t = await getTranslations("auth.completeProfile");
  return (
    <AuthCard title={t("title")}>
      <CompleteProfileForm />
    </AuthCard>
  );
}
