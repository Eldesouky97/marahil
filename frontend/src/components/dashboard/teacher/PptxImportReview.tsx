"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { QuizQuestionEditor } from "@/components/dashboard/teacher/QuizQuestionEditor";
import { SLIDE_ICONS } from "@/components/dashboard/teacher/slides/slideIcons";
import { computeInitialBoundaries, groupIntoLessons } from "@/lib/pptx/groupLessons";
import type { PptxSection } from "@/lib/pptx/parsePptx";
import type { LessonSlide } from "@/types/lessonSlide";

export interface ReviewedLesson {
  title: string;
  slides: LessonSlide[];
}

/**
 * Review step between "PPTX parsed" and "course actually created" — nothing
 * here touches Firestore. Only real PowerPoint Sections seed multiple lesson
 * groups automatically; everything else starts as one group, and the
 * "ابدأ درسًا جديدًا هنا" control is how a teacher splits any deck by hand
 * instead of the app guessing lesson boundaries from prose content.
 *
 * Quiz slides render expanded with the real question editor (same one
 * QuizBuilder/VideoSlideEditor use) instead of a plain label — a
 * PowerPoint-detected MCQ never comes with a known correct answer, so
 * leaving that to a "go fix it later" toast wasn't good enough; the teacher
 * needs to actually pick it before this ever reaches a student.
 */
export function PptxImportReview({
  slides,
  sections,
  onConfirm,
  onCancel,
}: {
  slides: LessonSlide[];
  sections: PptxSection[] | null;
  onConfirm: (lessons: ReviewedLesson[]) => void;
  onCancel: () => void;
}) {
  const t = useTranslations("dashboardTeacher.courseForm");
  const [workingSlides, setWorkingSlides] = useState<LessonSlide[]>(slides);
  const [boundaries, setBoundaries] = useState<number[]>(() => computeInitialBoundaries(slides.length, sections));
  const [titleOverrides, setTitleOverrides] = useState<Record<number, string>>({});

  function toggleBoundary(index: number) {
    if (index === 0) return;
    setBoundaries((prev) => (prev.includes(index) ? prev.filter((b) => b !== index) : [...prev, index].sort((a, b) => a - b)));
  }

  function updateSlide(globalIndex: number, patch: Partial<LessonSlide>) {
    setWorkingSlides((prev) => prev.map((s, i) => (i === globalIndex ? ({ ...s, ...patch } as LessonSlide) : s)));
  }

  function deleteSlide(globalIndex: number) {
    setWorkingSlides((prev) => prev.filter((_, i) => i !== globalIndex));
    setBoundaries((prev) => {
      const adjusted = prev.map((b) => (b > globalIndex ? b - 1 : b));
      return [...new Set(adjusted)].sort((a, b) => a - b);
    });
  }

  const rawGroups = groupIntoLessons(workingSlides, boundaries, sections, t("importedLessonFallbackTitle"));
  const groups = rawGroups.reduce<Array<{ start: number; title: string; slides: LessonSlide[] }>>((acc, group) => {
    const previous = acc[acc.length - 1];
    const start = previous ? previous.start + previous.slides.length : 0;
    acc.push({ start, ...group });
    return acc;
  }, []);

  function handleConfirm() {
    onConfirm(groups.map((g) => ({ title: (titleOverrides[g.start] ?? g.title).trim() || g.title, slides: g.slides })));
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-surface-2 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-heading">{t("importPptxReviewTitle")}</p>
        <button type="button" onClick={onCancel} className="cursor-pointer text-dim hover:text-danger" aria-label={t("importPptxRemove")}>
          <X size={15} />
        </button>
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div key={group.start} className="space-y-1.5">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 rounded-lg border border-border-strong bg-surface px-3 py-1.5 text-sm font-bold text-heading"
                value={titleOverrides[group.start] ?? group.title}
                onChange={(e) => setTitleOverrides((prev) => ({ ...prev, [group.start]: e.target.value }))}
              />
              {group.start > 0 && (
                <button
                  type="button"
                  onClick={() => toggleBoundary(group.start)}
                  className="shrink-0 cursor-pointer text-xs text-dim hover:text-danger"
                >
                  {t("importPptxMergeUp")}
                </button>
              )}
            </div>

            <div className="space-y-1 ps-3">
              {group.slides.map((slide, i) => {
                const globalIndex = group.start + i;
                const Icon = SLIDE_ICONS[slide.type];
                return (
                  <div key={slide.id}>
                    {globalIndex > 0 && !boundaries.includes(globalIndex) && (
                      <button
                        type="button"
                        onClick={() => toggleBoundary(globalIndex)}
                        className="my-1 flex cursor-pointer items-center gap-1 text-[11px] text-dim hover:text-accent"
                      >
                        <Plus size={11} /> {t("importPptxSplitHere")}
                      </button>
                    )}

                    {slide.type === "quiz" ? (
                      <div className="rounded-lg border border-gold/40 bg-gold/6 p-3">
                        <div className="mb-2 flex items-center gap-2 text-xs font-bold text-gold-ink">
                          <Icon size={13} className="shrink-0" />
                          {t("importPptxQuizReviewLabel")}
                        </div>
                        <QuizQuestionEditor
                          question={slide.questions[0]}
                          index={0}
                          onChange={(patch) => updateSlide(globalIndex, { questions: [{ ...slide.questions[0], ...patch }] })}
                          onDelete={() => deleteSlide(globalIndex)}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2">
                        <Icon size={13} className="shrink-0 text-accent" />
                        <span className="flex-1 truncate text-xs text-body">{slide.title || "…"}</span>
                        <button
                          type="button"
                          onClick={() => deleteSlide(globalIndex)}
                          className="shrink-0 cursor-pointer text-dim hover:text-danger"
                          aria-label={t("importPptxRemove")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <span className="text-xs text-dim">{t("importPptxReviewSummary", { lessons: groups.length, slides: workingSlides.length })}</span>
        <Button type="button" onClick={handleConfirm} className="px-4 py-2 text-sm">
          {t("importPptxReviewConfirm")}
        </Button>
      </div>
    </div>
  );
}
