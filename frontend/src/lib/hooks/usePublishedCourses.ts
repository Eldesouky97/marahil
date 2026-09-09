"use client";

import { useEffect, useState } from "react";
import { listPublishedCourses } from "@/lib/firebase/courses";
import type { Course } from "@/types/course";
import type { StageId } from "@/types/stage";

export function usePublishedCourses(stage: StageId | "all") {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    listPublishedCourses(stage === "all" ? undefined : stage)
      .then((data) => {
        if (!cancelled) setCourses(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [stage]);

  return { courses, loading };
}
