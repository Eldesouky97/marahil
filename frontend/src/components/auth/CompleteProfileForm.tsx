"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { User } from "firebase/auth";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { createUserProfile } from "@/lib/firebase/users";
import { RoleSwitch } from "./RoleSwitch";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import type { UserRole } from "@/types/user";

export function CompleteProfileForm() {
  const router = useRouter();
  const { firebaseUser, profile, loading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) router.replace("/auth/login");
    else if (profile) router.replace(`/dashboard/${profile.role}`);
  }, [authLoading, firebaseUser, profile, router]);

  if (authLoading || !firebaseUser || profile) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return <CompleteProfileFields firebaseUser={firebaseUser} />;
}

/** Only mounts once `firebaseUser` is confirmed non-null, so the lazy `useState` initializer below is reliable. */
function CompleteProfileFields({ firebaseUser }: { firebaseUser: User }) {
  const router = useRouter();
  const t = useTranslations("auth.completeProfile");

  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState(() => firebaseUser.displayName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createUserProfile(firebaseUser.uid, { name, email: firebaseUser.email ?? "", role });
      router.push(`/dashboard/${role}`);
    } catch {
      setError(t("error"));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RoleSwitch value={role} onChange={setRole} />

      <FormField label={t("name")}>
        <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>

      {error && <p className="text-sm text-danger-ink">{error}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
