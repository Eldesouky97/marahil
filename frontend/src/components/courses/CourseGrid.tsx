"use client";

import { useTranslations } from "next-intl";
import { CourseCard } from "./CourseCard";
import type { Course } from "@/types/course";

export function CourseGrid({ courses }: { courses: Course[] }) {
  const t = useTranslations("courses");
  if (courses.length === 0) {
    return <p className="py-16 text-center text-dim">{t("empty")}</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
