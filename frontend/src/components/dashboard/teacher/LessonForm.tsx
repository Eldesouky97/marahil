"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { addLesson, updateLesson } from "@/lib/firebase/courses";
import { QuizBuilder } from "./QuizBuilder";
import { LessonSimpleFields } from "./LessonSimpleFields";
import { SlideBuilder } from "./slides/SlideBuilder";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { Lesson } from "@/types/course";
import type { QuizQuestion } from "@/types/quiz";
import type { LessonSlide } from "@/types/lessonSlide";

export function LessonForm({
  courseId,
  nextOrder,
  lesson,
  onSaved,
  onCancel,
}: {
  courseId: string;
  nextOrder?: number;
  lesson?: Lesson;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const t = useTranslations("dashboardTeacher.lessonForm");
  const isEditing = !!lesson;

  const [title, setTitle] = useState(lesson?.title ?? "");
  const [mode, setMode] = useState<"simple" | "slides">(lesson?.slides?.length ? "slides" : "simple");
  const [videoUrl, setVideoUrl] = useState(lesson?.videoUrl ?? "");
  const [content, setContent] = useState(lesson?.content ?? "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(lesson?.imageUrl);
  const [slides, setSlides] = useState<LessonSlide[]>(lesson?.slides ?? []);
  const [includeQuiz, setIncludeQuiz] = useState(!!lesson?.quiz?.length);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(lesson?.quiz ?? []);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      title,
      order: lesson?.order ?? nextOrder ?? 0,
      videoUrl: mode === "simple" ? videoUrl || undefined : undefined,
      content: mode === "simple" ? content || undefined : undefined,
      imageUrl: mode === "simple" ? imageUrl : undefined,
      slides: mode === "slides" && slides.length > 0 ? slides : undefined,
      quiz: includeQuiz && quiz.length > 0 ? quiz : undefined,
    };

    if (lesson) {
      await updateLesson(courseId, lesson.id, payload);
    } else {
      await addLesson(courseId, payload);
      setTitle("");
      setVideoUrl("");
      setContent("");
      setImageUrl(undefined);
      setSlides([]);
      setQuiz([]);
      setIncludeQuiz(false);
      setMode("simple");
    }

    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface-2 p-5">
      <FormField label={t("title")}>
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("simple")}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs ${
            mode === "simple" ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-dim"
          }`}
        >
          {t("modeSimple")}
        </button>
        <button
          type="button"
          onClick={() => setMode("slides")}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-xs ${
            mode === "slides" ? "border-accent bg-accent/10 text-accent" : "border-border-strong text-dim"
          }`}
        >
          {t("modeSlides")}
        </button>
      </div>

      {mode === "simple" ? (
        <LessonSimpleFields
          videoUrl={videoUrl}
          onVideoUrlChange={setVideoUrl}
          content={content}
          onContentChange={setContent}
          imageUrl={imageUrl}
          onImageUrlChange={setImageUrl}
        />
      ) : (
        <SlideBuilder slides={slides} onChange={setSlides} />
      )}

      <label className="flex items-center gap-2 text-sm text-muted">
        <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
        {t("includeQuiz")}
      </label>

      {includeQuiz && <QuizBuilder questions={quiz} onChange={setQuiz} />}

      <div className="flex gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="px-5 py-2.5 text-sm">
            {t("cancel")}
          </Button>
        )}
        <Button type="submit" disabled={saving} className={onCancel ? "px-5 py-2.5 text-sm" : undefined}>
          {saving ? t("submitting") : isEditing ? t("save") : t("submit")}
        </Button>
      </div>
    </form>
  );
}
