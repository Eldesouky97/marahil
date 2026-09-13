"use client";

import { useEffect, useState } from "react";
import { listLessons } from "@/lib/firebase/courses";
import { getLessonAccessState } from "@/lib/utils/lessonAccess";
import type { EnrolledCourse } from "./useStudentDashboard";
import type { Course, Enrollment, Lesson } from "@/types/course";

export interface ContinueLearningData {
  course: Course;
  enrollment: Enrollment;
  nextLessonId: string | null;
  loading: boolean;
}

export function useContinueLearning(enrolledCourses: EnrolledCourse[]): ContinueLearningData | null {
  const candidate = [...enrolledCourses]
    .filter((c) => c.enrollment.progress < 100)
    .sort((a, b) => b.enrollment.updatedAt - a.enrollment.updatedAt)[0];

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidate) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    listLessons(candidate.course.id).then((l) => {
      if (cancelled) return;
      setLessons(l);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate?.course.id]);

  if (!candidate) return null;

  const accessMap = getLessonAccessState(lessons, candidate.enrollment.completedLessonIds);
  const nextLessonId = lessons.find((l) => accessMap.get(l.id) === "active")?.id ?? null;

  return { course: candidate.course, enrollment: candidate.enrollment, nextLessonId, loading };
}
