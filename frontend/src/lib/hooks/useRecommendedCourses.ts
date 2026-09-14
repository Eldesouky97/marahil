"use client";

import { useEffect, useState } from "react";
import { listPublishedCourses } from "@/lib/firebase/courses";
import type { Course } from "@/types/course";
import type { AppUser } from "@/types/user";
import type { EnrolledCourse } from "./useStudentDashboard";

const MAX_RECOMMENDATIONS = 4;

/**
 * No infra for a real recommender — a simple heuristic instead: published
 * courses in the same stage as the student's enrolled courses (or their
 * profile.stage if they haven't enrolled in anything yet), excluding what
 * they're already enrolled in, ranked by studentsCount.
 */
export function useRecommendedCourses(profile: AppUser | null, enrolledCourses: EnrolledCourse[]) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const enrolledIds = enrolledCourses.map((e) => e.course.id).join(",");
  const stages = Array.from(new Set(enrolledCourses.map((e) => e.course.stage)));
  const fallbackStage = profile?.stage;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const targetStages = stages.length > 0 ? stages : fallbackStage ? [fallbackStage] : [];
    if (targetStages.length === 0) {
      setCourses([]);
      setLoading(false);
      return;
    }

    Promise.all(targetStages.map((stage) => listPublishedCourses(stage))).then((results) => {
      if (cancelled) return;
      const enrolledSet = new Set(enrolledIds ? enrolledIds.split(",") : []);
      const seen = new Set<string>();
      const merged: Course[] = [];
      for (const list of results) {
        for (const course of list) {
          if (enrolledSet.has(course.id) || seen.has(course.id)) continue;
          seen.add(course.id);
          merged.push(course);
        }
      }
      merged.sort((a, b) => b.studentsCount - a.studentsCount);
      setCourses(merged.slice(0, MAX_RECOMMENDATIONS));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stages/enrolledIds are derived, stable-stringified deps
  }, [stages.join(","), enrolledIds, fallbackStage]);

  return { courses, loading };
}
