"use client";

import { useState } from "react";
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-white/10 bg-[#0F1729] p-5">
      <FormField label="عنوان الدرس">
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <FormField label="رابط الفيديو (تضمين، اختياري)">
        <input dir="ltr" className={inputClasses} value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/embed/..." />
      </FormField>

      <FormField label="شرح مكتوب (اختياري)">
        <textarea rows={4} className={inputClasses} value={content} onChange={(e) => setContent(e.target.value)} />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-[#C7CEE3]">
        <input type="checkbox" checked={includeQuiz} onChange={(e) => setIncludeQuiz(e.target.checked)} />
        إضافة اختبار قصير لهذا الدرس
      </label>

      {includeQuiz && <QuizBuilder questions={quiz} onChange={setQuiz} />}

      <Button type="submit" disabled={saving}>
        {saving ? "جارٍ الحفظ..." : "إضافة الدرس"}
      </Button>
    </form>
  );
}
