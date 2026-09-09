import { Suspense } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthCard title="إنشاء حساب جديد">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthCard>
  );
}
