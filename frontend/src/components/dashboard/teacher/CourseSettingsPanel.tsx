"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { updateCourse } from "@/lib/firebase/courses";
import { useStages } from "@/lib/hooks/useStages";
import { QuizBuilder } from "./QuizBuilder";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { Course, CourseMaterial } from "@/types/course";
import type { StageId } from "@/types/stage";
import type { QuizQuestion } from "@/types/quiz";

export function CourseSettingsPanel({ course, onSaved }: { course: Course; onSaved: () => void }) {
  const t = useTranslations("dashboardTeacher.courseSettings");
  const tCourseForm = useTranslations("dashboardTeacher.courseForm");
  const stages = useStages();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [stage, setStage] = useState<StageId>(course.stage);
  const [subject, setSubject] = useState(course.subject);
  const [coverImageUrl, setCoverImageUrl] = useState(course.coverImageUrl);
  const [price, setPrice] = useState(course.price ? String(course.price) : "");
  const [materials, setMaterials] = useState<CourseMaterial[]>(course.materials ?? []);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(course.quiz ?? []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentStage = stages.find((s) => s.id === stage) ?? stages[0];

  function markDirty() {
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    await updateCourse(course.id, {
      title,
      description,
      stage,
      subject,
      coverImageUrl,
      price: price ? Number(price) : 0,
      materials,
      quiz,
    });
    setSaving(false);
    setSaved(true);
    onSaved();
  }

  return (
    <div className="space-y-6 rounded-xl border border-border bg-surface-2 p-5">
      <FormField label={tCourseForm("title")}>
        <input
          className={inputClasses}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            markDirty();
          }}
        />
      </FormField>

      <FormField label={tCourseForm("description")}>
        <textarea
          rows={3}
          className={inputClasses}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            markDirty();
          }}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label={tCourseForm("stage")}>
          <select
            className={inputClasses}
            value={stage}
            onChange={(e) => {
              const nextStage = e.target.value as StageId;
              setStage(nextStage);
              setSubject(stages.find((s) => s.id === nextStage)!.subjects[0]);
              markDirty();
            }}
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={tCourseForm("subject")}>
          <select
            className={inputClasses}
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value);
              markDirty();
            }}
          >
            {currentStage.subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <FormField label={tCourseForm("coverImage")}>
        <ImageUploadField
          folder="course-covers"
          currentUrl={coverImageUrl}
          onUploaded={(url) => {
            setCoverImageUrl(url);
            markDirty();
          }}
        />
      </FormField>

      <FormField label={t("price")}>
        <input
          type="number"
          min={0}
          dir="ltr"
          className={inputClasses}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            markDirty();
          }}
        />
      </FormField>

      <div>
        <p className="mb-2 text-sm text-muted">{t("materials")}</p>
        {materials.length > 0 && (
          <div className="mb-2 space-y-2">
            {materials.map((m, i) => (
              <div
                key={`${m.url}-${i}`}
                className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <span className="truncate">{m.name}</span>
                <button
                  type="button"
                  onClick={() => {
                    setMaterials(materials.filter((_, idx) => idx !== i));
                    markDirty();
                  }}
                  className="cursor-pointer text-danger"
                  aria-label={t("removeMaterial")}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <FileUploadField
          folder="course-materials"
          onUploaded={(file) => {
            setMaterials([...materials, file]);
            markDirty();
          }}
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted">{t("quiz")}</p>
        <QuizBuilder
          questions={quiz}
          onChange={(q) => {
            setQuiz(q);
            markDirty();
          }}
        />
      </div>

      <Button onClick={save} disabled={saving || !title.trim() || !description.trim()} className="px-5 py-2.5 text-sm">
        {saving ? t("saving") : saved ? t("saved") : t("save")}
      </Button>
    </div>
  );
}
