"use client";

import { useCallback, useEffect, useState } from "react";
import { listAllCourses } from "@/lib/firebase/courses";
import type { Course } from "@/types/course";

export function useAdminCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setCourses(await listAllCourses());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { courses, loading, refresh };
}
