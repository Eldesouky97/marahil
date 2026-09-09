"use client";

import { useCallback, useEffect, useState } from "react";
import { listTeacherCourses } from "@/lib/firebase/courses";
import type { Course } from "@/types/course";

export function useTeacherCourses(teacherId: string | undefined) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teacherId) {
      setCourses([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setCourses(await listTeacherCourses(teacherId));
    setLoading(false);
  }, [teacherId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { courses, loading, refresh };
}
