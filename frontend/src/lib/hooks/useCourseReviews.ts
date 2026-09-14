"use client";

import { useCallback, useEffect, useState } from "react";
import { listCourseReviews } from "@/lib/firebase/reviews";
import type { Review } from "@/types/review";

export function useCourseReviews(courseId: string | undefined) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!courseId) {
      setReviews([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setReviews(await listCourseReviews(courseId));
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const average = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  return { reviews, average, count: reviews.length, loading, refresh };
}
