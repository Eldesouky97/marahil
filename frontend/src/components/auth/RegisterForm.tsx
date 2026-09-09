"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { registerUser } from "@/lib/firebase/auth";
import { RoleSwitch } from "./RoleSwitch";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { PersonalDetails, UserRole } from "@/types/user";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("auth.register");
  const initialRole = searchParams.get("role") === "teacher" ? "teacher" : "student";

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleFinish(details: PersonalDetails) {
    setError(null);
    setLoading(true);
    try {
      await registerUser(name, email, password, role, details);
      router.push(role === "teacher" ? "/auth/pending-approval" : `/dashboard/${role}`);
    } catch {
      setError(t("error"));
      setLoading(false);
    }
  }

  if (step === 2) {
    return (
      <>
        {error && <p className="mb-4 text-sm text-danger-ink">{error}</p>}
        <PersonalDetailsForm role={role} onSubmit={handleFinish} submitting={loading} onBack={() => setStep(1)} />
      </>
    );
  }

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <RoleSwitch value={role} onChange={setRole} />

      <FormField label={t("name")}>
        <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>
      <FormField label={t("email")}>
        <input
          type="email"
          required
          dir="ltr"
          className={inputClasses}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormField>
      <FormField label={t("password")}>
        <input
          type="password"
          required
          minLength={6}
          dir="ltr"
          className={inputClasses}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <Button type="submit" className="w-full">
        {t("next")}
      </Button>

      <div className="flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-border" />
        {t("orDivider")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton />

      <p className="text-center text-sm text-dim">
        {t("haveAccount")}{" "}
        <Link href="/auth/login" className="text-primary-strong">
          {t("login")}
        </Link>
      </p>
    </form>
  );
}
