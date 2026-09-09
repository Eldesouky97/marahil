"use client";

import { useTranslations } from "next-intl";
import { Users } from "lucide-react";
import { useStageLabel } from "@/lib/hooks/useStages";
import { cn } from "@/lib/utils/cn";
import type { Course } from "@/types/course";

export function AdminCourseRow({ course }: { course: Course }) {
  const stageLabel = useStageLabel();
  const t = useTranslations("dashboardAdmin.courses");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-medium">{course.title}</div>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dim">
          <span>{t("teacher")}: {course.teacherName}</span>
          <span>{stageLabel(course.stage)}</span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {course.studentsCount}
          </span>
          <span>{t("lessonsCount", { count: course.lessonsCount })}</span>
        </div>
      </div>

      <span
        className={cn(
          "self-start rounded-full border px-4 py-1.5 text-xs sm:self-auto",
          course.published ? "border-accent/40 bg-accent/10 text-accent" : "border-border-strong text-dim"
        )}
      >
        {course.published ? t("published") : t("draft")}
      </span>
    </div>
  );
}
