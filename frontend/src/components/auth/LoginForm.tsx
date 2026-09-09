"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import { loginUser } from "@/lib/firebase/auth";
import { getUserProfile } from "@/lib/firebase/users";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";

export function LoginForm() {
  const router = useRouter();
  const t = useTranslations("auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await loginUser(email, password);
      const profile = await getUserProfile(user.uid);
      router.push(profile ? `/dashboard/${profile.role}` : "/auth/complete-profile");
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          dir="ltr"
          className={inputClasses}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormField>

      <div className="text-end">
        <Link href="/auth/forgot-password" className="text-sm text-dim hover:text-primary-strong">
          {t("forgotPassword")}
        </Link>
      </div>

      {error && <p className="text-sm text-danger-ink">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("submitting") : t("submit")}
      </Button>

      <div className="flex items-center gap-3 text-xs text-faint">
        <span className="h-px flex-1 bg-border" />
        {t("orDivider")}
        <span className="h-px flex-1 bg-border" />
      </div>

      <GoogleSignInButton />

      <p className="text-center text-sm text-dim">
        {t("noAccount")}{" "}
        <Link href="/auth/register" className="text-primary-strong">
          {t("createAccount")}
        </Link>
      </p>
    </form>
  );
}
