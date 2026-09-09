"use client";

import { useCallback, useEffect, useState } from "react";
import { getEnrollment, enrollInCourse } from "@/lib/firebase/enrollments";
import type { Enrollment } from "@/types/course";

export function useEnrollment(uid: string | undefined, courseId: string) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!uid) {
      setEnrollment(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setEnrollment(await getEnrollment(uid, courseId));
    setLoading(false);
  }, [uid, courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function enroll() {
    if (!uid) return;
    await enrollInCourse(uid, courseId);
    await refresh();
  }

  return { enrollment, loading, enroll, refresh };
}
