"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { resetPassword } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";

/** Same "send a reset link" mechanism as ForgotPasswordForm and the admin's per-user reset button — no re-auth flow needed. */
export function ChangePasswordCard({ email }: { email: string }) {
  const t = useTranslations("profile");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleClick() {
    setSending(true);
    await resetPassword(email);
    setSending(false);
    setSent(true);
  }

  return (
    <div className="space-y-3 rounded-2xl border border-border bg-surface p-6">
      <h2 className="font-display text-lg text-heading">{t("changePassword")}</h2>
      <p className="text-sm text-dim">{t("changePasswordDesc")}</p>
      {sent ? (
        <p className="text-sm text-success">{t("changePasswordSent")}</p>
      ) : (
        <Button variant="outline" onClick={handleClick} disabled={sending} className="px-5 py-2 text-sm">
          {sending ? t("changePasswordSending") : t("changePasswordCta")}
        </Button>
      )}
    </div>
  );
}
