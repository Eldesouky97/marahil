"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useState } from "react";
import { Users } from "lucide-react";
import { setCoursePublished } from "@/lib/firebase/courses";
import { useStageLabel } from "@/lib/hooks/useStages";
import { cn } from "@/lib/utils/cn";
import type { Course } from "@/types/course";

export function TeacherCourseRow({ course }: { course: Course }) {
  const [published, setPublished] = useState(course.published);
  const [saving, setSaving] = useState(false);
  const stageLabel = useStageLabel();
  const t = useTranslations("dashboardTeacher");

  async function togglePublish() {
    setSaving(true);
    const next = !published;
    await setCoursePublished(course.id, next);
    setPublished(next);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href={`/dashboard/teacher/courses/${course.id}`} className="font-medium hover:text-primary-strong">
          {course.title}
        </Link>
        <div className="mt-1 flex items-center gap-3 text-xs text-dim">
          <span>{stageLabel(course.stage)}</span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {course.studentsCount}
          </span>
          <span>{t("lessonsCount", { count: course.lessonsCount })}</span>
        </div>
      </div>

      <button
        onClick={togglePublish}
        disabled={saving}
        className={cn(
          "cursor-pointer self-start rounded-full border px-4 py-1.5 text-xs transition-colors sm:self-auto",
          published ? "border-accent/40 bg-accent/10 text-accent" : "border-border-strong text-dim"
        )}
      >
        {published ? t("published") : t("draft")}
      </button>
    </div>
  );
}
