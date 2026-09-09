"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createCourse } from "@/lib/firebase/courses";
import { useStages } from "@/lib/hooks/useStages";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import type { StageId } from "@/types/stage";

export function CourseForm() {
  const router = useRouter();
  const { profile } = useAuth();
  const stages = useStages();
  const t = useTranslations("dashboardTeacher.courseForm");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<StageId>("primary");
  const [subject, setSubject] = useState(stages[1].subjects[0]);
  const [saving, setSaving] = useState(false);

  const currentStage = stages.find((s) => s.id === stage)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    const courseId = await createCourse({
      title,
      description,
      stage,
      subject,
      teacherId: profile.uid,
      teacherName: profile.name,
      coverIcon: "BookOpen",
    });
    router.push(`/dashboard/teacher/courses/${courseId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <FormField label={t("title")}>
        <input required className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
      </FormField>

      <FormField label={t("description")}>
        <textarea
          required
          rows={3}
          className={inputClasses}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-2 gap-4">
        <FormField label={t("stage")}>
          <select
            className={inputClasses}
            value={stage}
            onChange={(e) => {
              const nextStage = e.target.value as StageId;
              setStage(nextStage);
              setSubject(stages.find((s) => s.id === nextStage)!.subjects[0]);
            }}
          >
            {stages.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label={t("subject")}>
          <select className={inputClasses} value={subject} onChange={(e) => setSubject(e.target.value)}>
            {currentStage.subjects.map((subj) => (
              <option key={subj} value={subj}>
                {subj}
              </option>
            ))}
          </select>
        </FormField>
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
