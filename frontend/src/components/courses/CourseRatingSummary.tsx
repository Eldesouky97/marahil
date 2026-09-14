"use client";

import { useTranslations } from "next-intl";
import { RatingStars } from "./RatingStars";
import { useCourseReviews } from "@/lib/hooks/useCourseReviews";

export function CourseRatingSummary({ courseId }: { courseId: string }) {
  const { average, count, loading } = useCourseReviews(courseId);
  const t = useTranslations("reviews");

  if (loading || count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <RatingStars value={average} />
      <span className="font-bold text-heading">{average.toFixed(1)}</span>
      <span className="text-dim">{t("reviewsCount", { count })}</span>
    </div>
  );
}
