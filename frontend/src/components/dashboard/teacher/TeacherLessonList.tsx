"use client";

import { useTranslations } from "next-intl";
import { ClipboardCheck, PlayCircle } from "lucide-react";
import type { Lesson } from "@/types/course";

export function TeacherLessonList({ lessons }: { lessons: Lesson[] }) {
  const t = useTranslations("dashboardTeacher.manageCourse");
  if (lessons.length === 0) {
    return <p className="text-sm text-dim">{t("noLessons")}</p>;
  }
  return (
    <ul className="space-y-2">
      {lessons.map((lesson, i) => (
        <li key={lesson.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <PlayCircle size={17} />
          </span>
          <span className="flex-1 truncate text-sm font-medium">
            {i + 1}. {lesson.title}
          </span>
          {lesson.quiz && lesson.quiz.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-primary">
              <ClipboardCheck size={13} /> {t("questionsCount", { count: lesson.quiz.length })}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
