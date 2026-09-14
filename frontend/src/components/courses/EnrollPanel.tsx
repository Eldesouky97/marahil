"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useEnrollment } from "@/lib/hooks/useEnrollment";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ReviewForm } from "./ReviewForm";
import type { Course } from "@/types/course";

function PriceRow({ course }: { course: Course }) {
  const t = useTranslations("courses");
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <span className="text-xs text-dim">{t("priceLabel")}</span>
      <span className="text-lg font-bold text-heading">
        {course.price ? t("priceValue", { price: course.price }) : t("priceFree")}
      </span>
    </div>
  );
}

export function EnrollPanel({ course }: { course: Course }) {
  const courseId = course.id;
  const { profile, loading: authLoading } = useAuth();
  const { enrollment, loading, enroll } = useEnrollment(profile?.uid, courseId);
  const t = useTranslations("courses");

  if (authLoading || loading) return null;

  if (!profile) {
    return (
      <div>
        <PriceRow course={course} />
        <Link href="/auth/login">
          <Button className="w-full">{t("loginToEnroll")}</Button>
        </Link>
      </div>
    );
  }

  if (profile.role === "teacher") {
    return <p className="text-sm text-dim">{t("teacherOnlyNotice")}</p>;
  }

  if (!enrollment) {
    return (
      <div>
        <PriceRow course={course} />
        <Button className="w-full" onClick={enroll}>
          {t("enrollCta")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-dim">{t("progressLabel")}</span>
        <span className="text-primary-strong">{enrollment.progress}%</span>
      </div>
      <ProgressBar value={enrollment.progress} />
      {enrollment.progress === 100 && <ReviewForm course={course} profile={profile} />}
    </div>
  );
}
