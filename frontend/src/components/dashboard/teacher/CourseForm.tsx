"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { createCourse, addLesson } from "@/lib/firebase/courses";
import { useStages } from "@/lib/hooks/useStages";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import { PptxImportButton } from "@/components/dashboard/teacher/slides/PptxImportButton";
import type { StageId } from "@/types/stage";
import type { LessonSlide } from "@/types/lessonSlide";

export function CourseForm() {
  const router = useRouter();
  const { profile } = useAuth();
  const stages = useStages();
  const { showToast } = useToast();
  const t = useTranslations("dashboardTeacher.courseForm");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stage, setStage] = useState<StageId>("primary");
  const [subject, setSubject] = useState(stages[1].subjects[0]);
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [price, setPrice] = useState("");
  const [importedSlides, setImportedSlides] = useState<LessonSlide[] | null>(null);
  const [saving, setSaving] = useState(false);

  const currentStage = stages.find((s) => s.id === stage)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    let courseId: string;
    try {
      courseId = await createCourse({
        title,
        description,
        stage,
        subject,
        teacherId: profile.uid,
        teacherName: profile.name,
        coverIcon: "BookOpen",
        coverImageUrl,
        price: price ? Number(price) : undefined,
      });
    } catch (err) {
      console.error("createCourse failed:", err);
      showToast(t("createFailed"), { tone: "error" });
      setSaving(false);
      return;
    }

    if (importedSlides && importedSlides.length > 0) {
      try {
        await addLesson(courseId, {
          title: importedSlides[0]?.title || t("importedLessonFallbackTitle"),
          order: 0,
          slides: importedSlides,
        });
      } catch (err) {
        // The course itself was created fine — don't strand the teacher on this
        // form over the lesson step failing; let them retry adding it from there.
        console.error("addLesson (pptx import) failed:", err);
        showToast(t("importPptxLessonFailed"), { tone: "error", duration: 7000 });
      }
    }

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

      <FormField label={t("coverImage")}>
        <ImageUploadField folder="course-covers" onUploaded={setCoverImageUrl} />
      </FormField>

      <FormField label={t("price")}>
        <input
          type="number"
          min={0}
          dir="ltr"
          className={inputClasses}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder={t("pricePlaceholder")}
        />
      </FormField>

      <FormField label={t("importPptxLabel")}>
        {importedSlides ? (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm text-accent-ink">
            <span>{t("importPptxSummary", { count: importedSlides.length })}</span>
            <button
              type="button"
              onClick={() => setImportedSlides(null)}
              className="shrink-0 cursor-pointer text-danger"
              aria-label={t("importPptxRemove")}
            >
              <X size={15} />
            </button>
          </div>
        ) : (
          <PptxImportButton onImported={setImportedSlides} />
        )}
      </FormField>

      <Button type="submit" disabled={saving}>
        {saving ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}
