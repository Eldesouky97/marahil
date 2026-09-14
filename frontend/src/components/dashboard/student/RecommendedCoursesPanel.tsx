"use client";

import { useTranslations } from "next-intl";
import { CourseCard } from "@/components/courses/CourseCard";
import type { Course } from "@/types/course";

export function RecommendedCoursesPanel({ courses }: { courses: Course[] }) {
  const t = useTranslations("dashboardStudent");

  if (courses.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold">{t("recommendedTitle")}</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}
