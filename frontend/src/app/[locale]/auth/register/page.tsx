import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default async function RegisterPage() {
  const t = await getTranslations("auth.register");
  return (
    <AuthCard title={t("title")}>
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
