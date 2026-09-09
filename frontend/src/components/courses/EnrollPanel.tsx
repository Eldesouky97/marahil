"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useEnrollment } from "@/lib/hooks/useEnrollment";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function EnrollPanel({ courseId }: { courseId: string }) {
  const { profile, loading: authLoading } = useAuth();
  const { enrollment, loading, enroll } = useEnrollment(profile?.uid, courseId);
  const t = useTranslations("courses");

  if (authLoading || loading) return null;

  if (!profile) {
    return (
      <Link href="/auth/login">
        <Button className="w-full">{t("loginToEnroll")}</Button>
      </Link>
    );
  }

  if (profile.role === "teacher") {
    return <p className="text-sm text-dim">{t("teacherOnlyNotice")}</p>;
  }

  if (!enrollment) {
    return (
      <Button className="w-full" onClick={enroll}>
        {t("enrollCta")}
      </Button>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-dim">{t("progressLabel")}</span>
        <span className="text-primary-strong">{enrollment.progress}%</span>
      </div>
      <ProgressBar value={enrollment.progress} />
    </div>
  );
}
