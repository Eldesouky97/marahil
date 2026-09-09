"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { updateCourse } from "@/lib/firebase/courses";
import { useStages } from "@/lib/hooks/useStages";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { Course } from "@/types/course";
import type { StageId } from "@/types/stage";

export function AdminCourseEditForm({ course, onSaved }: { course: Course; onSaved: () => void }) {
  const t = useTranslations("dashboardAdmin.manageCourse");
  const tCourseForm = useTranslations("dashboardTeacher.courseForm");
  const stages = useStages();

  const [title, setTitle] = useState(course.title);
  const [description, setDescription] = useState(course.description);
  const [stage, setStage] = useState<StageId>(course.stage);
  const [subject, setSubject] = useState(course.subject);
  const [saving, setSaving] = useState(false);

  const currentStage = stages.find((s) => s.id === stage) ?? stages[0];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await updateCourse(course.id, { title, description, stage, subject });
    setSaving(false);
    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-surface-2 p-5">
      <FormField label={tCourseForm("title")}>
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <FormField label={tCourseForm("description")}>
        <textarea
          required
          rows={3}
          className={inputClasses}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={tCourseForm("stage")}>
          <select
            className={inputClasses}
            value={stage}
            onChange={(e) => {
              const nextStage = e.target.value as StageId;
              setStage(nextStage);
              setSubject(stages.find((s) => s.id === nextStage)?.subjects[0] ?? "");
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
          <select className={inputClasses} value={subject} onChange={(e) => setSubject(e.target.value)}>
            {currentStage.subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <Button type="submit" disabled={saving} className="px-5 py-2.5 text-sm">
        {saving ? t("saving") : t("save")}
      </Button>
    </form>
  );
}
