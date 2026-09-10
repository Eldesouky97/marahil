"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { User } from "firebase/auth";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { createUserProfile } from "@/lib/firebase/users";
import { RoleSwitch } from "./RoleSwitch";
import { PersonalDetailsForm } from "./PersonalDetailsForm";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import type { PersonalDetails, UserRole } from "@/types/user";

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

  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<UserRole>("student");
  const [name, setName] = useState(() => firebaseUser.displayName ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    setStep(2);
  }

  async function handleFinish(details: PersonalDetails) {
    setError(null);
    setSubmitting(true);
    try {
      await createUserProfile(firebaseUser.uid, {
        name,
        email: firebaseUser.email ?? "",
        role,
        photoURL: firebaseUser.photoURL ?? undefined,
        ...details,
      });
      router.push(role === "teacher" ? "/auth/pending-approval" : `/dashboard/${role}`);
    } catch {
      setError(t("error"));
      setSubmitting(false);
    }
  }

  if (step === 2) {
    return (
      <>
        {error && <p className="mb-4 text-sm text-danger-ink">{error}</p>}
        <PersonalDetailsForm role={role} onSubmit={handleFinish} submitting={submitting} onBack={() => setStep(1)} />
      </>
    );
  }

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <RoleSwitch value={role} onChange={setRole} />

      <FormField label={t("name")}>
        <input required className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
      </FormField>

      <Button type="submit" className="w-full">
        {t("next")}
      </Button>
    </form>
  );
}
