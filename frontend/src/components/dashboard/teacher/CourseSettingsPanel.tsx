"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { updateCourse } from "@/lib/firebase/courses";
import { QuizBuilder } from "./QuizBuilder";
import { FileUploadField } from "@/components/ui/FileUploadField";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { Course, CourseMaterial } from "@/types/course";
import type { QuizQuestion } from "@/types/quiz";

export function CourseSettingsPanel({ course, onSaved }: { course: Course; onSaved: () => void }) {
  const t = useTranslations("dashboardTeacher.courseSettings");
  const [price, setPrice] = useState(course.price ? String(course.price) : "");
  const [materials, setMaterials] = useState<CourseMaterial[]>(course.materials ?? []);
  const [quiz, setQuiz] = useState<QuizQuestion[]>(course.quiz ?? []);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    await updateCourse(course.id, {
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
      <FormField label={t("price")}>
        <input
          type="number"
          min={0}
          dir="ltr"
          className={inputClasses}
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
            setSaved(false);
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
                    setSaved(false);
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
            setSaved(false);
          }}
        />
      </div>

      <div>
        <p className="mb-2 text-sm text-muted">{t("quiz")}</p>
        <QuizBuilder
          questions={quiz}
          onChange={(q) => {
            setQuiz(q);
            setSaved(false);
          }}
        />
      </div>

      <Button onClick={save} disabled={saving} className="px-5 py-2.5 text-sm">
        {saving ? t("saving") : saved ? t("saved") : t("save")}
      </Button>
    </div>
  );
}
