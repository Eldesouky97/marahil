"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { updateUserPhoto } from "@/lib/firebase/users";
import { isPendingTeacher } from "@/lib/utils/userStatus";
import { ProfileEditForm } from "./ProfileEditForm";
import { ChangePasswordCard } from "./ChangePasswordCard";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function ProfileView() {
  const router = useRouter();
  const { firebaseUser, profile, loading, refreshProfile } = useAuth();
  const t = useTranslations("profile");
  const tRole = useTranslations("dashboardAdmin.users");

  useEffect(() => {
    if (!loading && !firebaseUser) router.replace("/auth/login");
  }, [loading, firebaseUser, router]);

  if (loading || !firebaseUser || !profile) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  const hasPasswordProvider = firebaseUser.providerData.some((p) => p.providerId === "password");
  const pending = isPendingTeacher(profile);

  async function handleUploaded(url: string) {
    await updateUserPhoto(profile!.uid, url);
    await refreshProfile();
  }

  return (
    <section className="py-12">
      <Container size="lg">
        <h1 className="mb-8 font-display text-2xl text-heading">{t("title")}</h1>

        <div className="space-y-6">
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-2 text-sm text-muted">{t("avatar")}</p>
              <ImageUploadField folder="avatars" currentUrl={profile.photoURL} onUploaded={handleUploaded} />
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
              <Badge>{tRole(`role_${profile.role}`)}</Badge>
              {profile.role === "teacher" && (
                <Badge className={pending ? "border-gold/40 bg-gold/10 text-gold-strong" : ""}>
                  {pending ? tRole("statusPending") : tRole("statusApproved")}
                </Badge>
              )}
              {profile.disabled && (
                <Badge className="border-danger/40 bg-danger/10 text-danger-ink">{tRole("statusDisabled")}</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-faint">{t("email")}</p>
              <p className="font-medium" dir="ltr">
                {profile.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-faint">{tRole("joined")}</p>
              <p className="font-medium">{new Date(profile.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <ProfileEditForm profile={profile} onSaved={refreshProfile} />

          {hasPasswordProvider && <ChangePasswordCard email={profile.email} />}
        </div>
      </Container>
    </section>
  );
}
