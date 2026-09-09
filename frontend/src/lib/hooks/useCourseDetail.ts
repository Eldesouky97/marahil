"use client";

import { useCallback, useEffect, useState } from "react";
import { getCourse, listLessons } from "@/lib/firebase/courses";
import type { Course, Lesson } from "@/types/course";

export function useCourseDetail(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const [courseData, lessonData] = await Promise.all([getCourse(courseId), listLessons(courseId)]);
    setCourse(courseData);
    setLessons(lessonData);
    setLoading(false);
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { course, lessons, loading, refresh };
}
