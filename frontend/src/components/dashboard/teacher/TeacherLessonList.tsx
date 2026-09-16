"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUp, ClipboardCheck, Copy, Eye, Layers, Pencil, PlayCircle, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { addLesson, deleteLesson, updateLesson } from "@/lib/firebase/courses";
import { LessonForm } from "./LessonForm";
import type { Lesson } from "@/types/course";

export function TeacherLessonList({
  courseId,
  lessons,
  onChanged,
}: {
  courseId: string;
  lessons: Lesson[];
  onChanged: () => void;
}) {
  const t = useTranslations("dashboardTeacher.manageCourse");
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (lessons.length === 0) {
    return <p className="text-sm text-dim">{t("noLessons")}</p>;
  }

  async function handleDelete(lessonId: string) {
    await deleteLesson(courseId, lessonId);
    onChanged();
  }

  async function handleMove(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= lessons.length) return;
    setBusy(true);
    const a = lessons[index];
    const b = lessons[target];
    await Promise.all([updateLesson(courseId, a.id, { order: b.order }), updateLesson(courseId, b.id, { order: a.order })]);
    setBusy(false);
    onChanged();
  }

  async function handleDuplicate(lesson: Lesson) {
    setBusy(true);
    await addLesson(courseId, {
      title: `${lesson.title} ${t("duplicateSuffix")}`,
      order: lessons.length,
      videoUrl: lesson.videoUrl,
      content: lesson.content,
      imageUrl: lesson.imageUrl,
      slides: lesson.slides,
      quiz: lesson.quiz,
    });
    setBusy(false);
    onChanged();
  }

  return (
    <ul className="space-y-2">
      {lessons.map((lesson, i) =>
        editingLessonId === lesson.id ? (
          <li key={lesson.id}>
            <LessonForm
              courseId={courseId}
              lesson={lesson}
              onSaved={() => {
                setEditingLessonId(null);
                onChanged();
              }}
              onCancel={() => setEditingLessonId(null)}
            />
          </li>
        ) : (
          <li key={lesson.id} className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {lesson.slides?.length ? <Layers size={17} /> : <PlayCircle size={17} />}
            </span>
            <span className="flex-1 truncate text-sm font-medium">
              {i + 1}. {lesson.title}
            </span>
            {lesson.quiz && lesson.quiz.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-primary">
                <ClipboardCheck size={13} /> {t("questionsCount", { count: lesson.quiz.length })}
              </span>
            )}
            <button
              type="button"
              onClick={() => handleMove(i, -1)}
              disabled={busy || i === 0}
              className="cursor-pointer text-dim hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("moveUp")}
            >
              <ArrowUp size={15} />
            </button>
            <button
              type="button"
              onClick={() => handleMove(i, 1)}
              disabled={busy || i === lessons.length - 1}
              className="cursor-pointer text-dim hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("moveDown")}
            >
              <ArrowDown size={15} />
            </button>
            <Link
              href={`/learn/${courseId}/${lesson.id}`}
              className="text-dim hover:text-primary-strong"
              aria-label={t("previewLesson")}
            >
              <Eye size={15} />
            </Link>
            <button
              type="button"
              onClick={() => handleDuplicate(lesson)}
              disabled={busy}
              className="cursor-pointer text-dim hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-30"
              aria-label={t("duplicateLesson")}
            >
              <Copy size={15} />
            </button>
            <button
              type="button"
              onClick={() => setEditingLessonId(lesson.id)}
              className="cursor-pointer text-dim hover:text-primary-strong"
              aria-label={t("editLesson")}
            >
              <Pencil size={15} />
            </button>
            <button type="button" onClick={() => handleDelete(lesson.id)} className="cursor-pointer text-danger" aria-label={t("deleteLesson")}>
              <Trash2 size={15} />
            </button>
          </li>
        )
      )}
    </ul>
  );
}
