"use client";

import { useTranslations } from "next-intl";
import { ClipboardCheck, Pencil, PlayCircle, Trash2 } from "lucide-react";
import type { Lesson } from "@/types/course";

export function AdminLessonRow({
  lesson,
  index,
  onEdit,
  onDelete,
}: {
  lesson: Lesson;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboardAdmin.manageCourse");
  const tManageCourse = useTranslations("dashboardTeacher.manageCourse");

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <PlayCircle size={17} />
      </span>
      <span className="flex-1 truncate text-sm font-medium">
        {index + 1}. {lesson.title}
      </span>
      {lesson.quiz && lesson.quiz.length > 0 && (
        <span className="flex items-center gap-1 text-xs text-primary">
          <ClipboardCheck size={13} /> {tManageCourse("questionsCount", { count: lesson.quiz.length })}
        </span>
      )}
      <button type="button" onClick={onEdit} className="cursor-pointer text-dim hover:text-primary-strong" aria-label={t("editLesson")}>
        <Pencil size={15} />
      </button>
      <button type="button" onClick={onDelete} className="cursor-pointer text-danger" aria-label={t("deleteLesson")}>
        <Trash2 size={15} />
      </button>
    </div>
  );
}
