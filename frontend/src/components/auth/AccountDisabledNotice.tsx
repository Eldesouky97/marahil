"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { logoutUser } from "@/lib/firebase/auth";
import { isAccountDisabled } from "@/lib/utils/userStatus";
import { ContactAdminNotice } from "./ContactAdminNotice";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function AccountDisabledNotice() {
  const router = useRouter();
  const { firebaseUser, profile, loading, refreshProfile } = useAuth();
  const t = useTranslations("auth.accountDisabled");
  const [checking, setChecking] = useState(false);

  const disabled = isAccountDisabled(profile);

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) router.replace("/auth/login");
    else if (profile && !disabled) router.replace(`/dashboard/${profile.role}`);
  }, [loading, firebaseUser, profile, disabled, router]);

  if (loading || !firebaseUser || (profile && !disabled)) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  async function handleCheckAgain() {
    setChecking(true);
    await refreshProfile();
    setChecking(false);
  }

  return (
    <div className="space-y-6 text-center">
      <p className="text-sm text-body">{t("message")}</p>
      <ContactAdminNotice />
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" onClick={handleCheckAgain} disabled={checking} className="flex-1">
          {checking ? t("checking") : t("checkAgain")}
        </Button>
        <Button variant="ghost" onClick={() => logoutUser()} className="flex-1">
          {t("signOut")}
        </Button>
      </div>
    </div>
  );
}
