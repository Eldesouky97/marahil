"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addLesson } from "@/lib/firebase/courses";
import { QuizBuilder } from "./QuizBuilder";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { QuizQuestion } from "@/types/quiz";

export function LessonForm({
  courseId,
  nextOrder,
  onCreated,
}: {
  courseId: string;
  nextOrder: number;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [includeQuiz, setIncludeQuiz] = useState(false);
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [saving, setSaving] = useState(false);
  const t = useTranslations("dashboardTeacher.lessonForm");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await addLesson(courseId, {
      title,
      order: nextOrder,
      videoUrl: videoUrl || undefined,
      content: content || undefined,
      quiz: includeQuiz && quiz.length > 0 ? quiz : undefined,
    });
    setTitle("");
    setVideoUrl("");
    setContent("");
    setQuiz([]);
    setIncludeQuiz(false);
    setSaving(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface-2 p-5">
      <FormField label={t("title")}>
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <FormField label={t("videoLabel")}>
        <input
          dir="ltr"
          className={inputClasses}
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/embed/..."
        />
      </FormField>

      <FormField label={t("contentLabel")}>
        <textarea rows={4} className={inputClasses} value={content} onChange={(e) => setContent(e.target.value)} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
        {t("includeQuiz")}
      </label>

      {includeQuiz && <QuizBuilder questions={quiz} onChange={setQuiz} />}

      <Button type="submit" disabled={saving}>
        {saving ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
