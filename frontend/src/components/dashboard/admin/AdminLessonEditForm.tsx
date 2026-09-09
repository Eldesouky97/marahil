"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateLesson } from "@/lib/firebase/courses";
import { QuizBuilder } from "@/components/dashboard/teacher/QuizBuilder";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import type { Lesson } from "@/types/course";
import type { QuizQuestion } from "@/types/quiz";

export function AdminLessonEditForm({
  courseId,
  lesson,
  onSaved,
  onCancel,
}: {
  courseId: string;
  lesson: Lesson;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dashboardAdmin.manageCourse");
  const tLessonForm = useTranslations("dashboardTeacher.lessonForm");

  const [title, setTitle] = useState(lesson.title);
  const [videoUrl, setVideoUrl] = useState(lesson.videoUrl ?? "");
  const [content, setContent] = useState(lesson.content ?? "");
  const [imageUrl, setImageUrl] = useState(lesson.imageUrl);
  const [includeQuiz, setIncludeQuiz] = useState(!!lesson.quiz?.length);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(lesson.quiz ?? []);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateLesson(courseId, lesson.id, {
      title,
      order: lesson.order,
      videoUrl: videoUrl || undefined,
      content: content || undefined,
      imageUrl,
      quiz: includeQuiz && quiz.length > 0 ? quiz : undefined,
    });
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface-2 p-5">
      <FormField label={tLessonForm("title")}>
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <FormField label={tLessonForm("videoLabel")}>
        <input dir="ltr" className={inputClasses} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
      </FormField>

      <FormField label={tLessonForm("contentLabel")}>
        <textarea rows={4} className={inputClasses} value={content} onChange={(e) => setContent(e.target.value)} />
      </FormField>

      <FormField label={tLessonForm("image")}>
        <ImageUploadField folder="lesson-images" currentUrl={imageUrl} onUploaded={setImageUrl} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
        {tLessonForm("includeQuiz")}
      </label>

      {includeQuiz && <QuizBuilder questions={quiz} onChange={setQuiz} />}

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onCancel} className="px-5 py-2.5 text-sm">
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={saving} className="px-5 py-2.5 text-sm">
          {saving ? t("saving") : t("save")}
        </Button>
      </div>
    </form>
  );
}
