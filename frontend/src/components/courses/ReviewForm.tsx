"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { RatingStars } from "./RatingStars";
import { getUserReview, createReview } from "@/lib/firebase/reviews";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";
import type { Course } from "@/types/course";
import type { AppUser } from "@/types/user";

export function ReviewForm({ course, profile }: { course: Course; profile: AppUser }) {
  const t = useTranslations("reviews");
  const [checked, setChecked] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getUserReview(profile.uid, course.id).then((existing) => {
      if (cancelled) return;
      setAlreadyReviewed(!!existing);
      setChecked(true);
    });
    return () => {
      cancelled = true;
    };
  }, [profile.uid, course.id]);

  if (!checked || alreadyReviewed || done) {
    return done || alreadyReviewed ? <p className="mt-4 text-xs text-dim">{t("thanks")}</p> : null;
  }

  async function submit() {
    if (rating === 0) return;
    setSaving(true);
    await createReview({
      uid: profile.uid,
      studentName: profile.name,
      courseId: course.id,
      courseTitle: course.title,
      rating,
      comment: comment.trim() || undefined,
    });
    setSaving(false);
    setDone(true);
  }

  return (
    <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
      <p className="mb-2 text-sm font-bold">{t("prompt")}</p>
      <RatingStars value={rating} interactive size={22} onChange={setRating} />
      <textarea
        className={`${inputClasses} mt-3`}
        rows={2}
        placeholder={t("commentPlaceholder")}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button className="mt-3 px-5 py-2 text-sm" disabled={rating === 0 || saving} onClick={submit}>
        {saving ? t("submitting") : t("submit")}
      </Button>
    </div>
  );
}
