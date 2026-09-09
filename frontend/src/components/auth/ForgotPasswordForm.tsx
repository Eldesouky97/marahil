"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { resetPassword } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";

export function ForgotPasswordForm() {
  const t = useTranslations("auth.forgotPassword");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      const code = (err as { code?: string }).code;
      // Never reveal whether the email is registered — only surface real failures.
      if (code === "auth/user-not-found" || code === "auth/invalid-email") {
        setSent(true);
      } else {
        setError(t("error"));
      }
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-sm text-body">{t("success")}</p>
        <Link href="/auth/login" className="text-sm text-primary-strong">
          {t("backToLogin")}
        </Link>
      </div>
    );
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

      {error && <p className="text-sm text-danger-ink">{error}</p>}

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? t("submitting") : t("submit")}
      </Button>

      <p className="text-center text-sm text-dim">
        <Link href="/auth/login" className="text-primary-strong">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
