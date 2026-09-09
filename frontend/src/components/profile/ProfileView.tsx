"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { updateUserPhoto } from "@/lib/firebase/users";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
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

  async function handleUploaded(url: string) {
    await updateUserPhoto(profile!.uid, url);
    await refreshProfile();
  }

  return (
    <section className="py-12">
      <Container size="lg">
        <h1 className="mb-8 font-display text-2xl text-heading">{t("title")}</h1>

        <div className="space-y-6 rounded-2xl border border-border bg-surface-2 p-6">
          <div>
            <p className="mb-2 text-sm text-muted">{t("avatar")}</p>
            <ImageUploadField folder="avatars" currentUrl={profile.photoURL} onUploaded={handleUploaded} />
          </div>

          <div>
            <p className="text-xs text-faint">{t("name")}</p>
            <p className="font-medium">{profile.name}</p>
          </div>
          <div>
            <p className="text-xs text-faint">{t("email")}</p>
            <p className="font-medium" dir="ltr">
              {profile.email}
            </p>
          </div>
          <div>
            <p className="text-xs text-faint">{t("role")}</p>
            <p className="font-medium">{tRole(`role_${profile.role}`)}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
