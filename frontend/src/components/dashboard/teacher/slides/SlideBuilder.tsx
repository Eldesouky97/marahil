"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AlignLeft, ArrowDown, ArrowUp, ClipboardCheck, Code2, MousePointerClick, Plus, Shuffle, Trash2, Video } from "lucide-react";
import { TextSlideEditor } from "./TextSlideEditor";
import { VideoSlideEditor } from "./VideoSlideEditor";
import { QuizSlideEditor } from "./QuizSlideEditor";
import { CodeSlideEditor } from "./CodeSlideEditor";
import { HotspotSlideEditor } from "./HotspotSlideEditor";
import { MatchingSlideEditor } from "./MatchingSlideEditor";
import { inputClasses } from "@/components/ui/FormField";
import type { LessonSlide, LessonSlideType } from "@/types/lessonSlide";

const SLIDE_TYPES: LessonSlideType[] = ["text", "video", "quiz", "code", "hotspot", "matching"];

const SLIDE_ICONS: Record<LessonSlideType, typeof AlignLeft> = {
  text: AlignLeft,
  video: Video,
  quiz: ClipboardCheck,
  code: Code2,
  hotspot: MousePointerClick,
  matching: Shuffle,
};

function emptySlide(type: LessonSlideType): LessonSlide {
  const id = crypto.randomUUID();
  switch (type) {
    case "text":
      return { id, type, body: "" };
    case "video":
      return { id, type, source: "youtube", videoUrl: "" };
    case "quiz":
      return { id, type, questions: [] };
    case "code":
      return { id, type, language: "javascript", code: "" };
    case "hotspot":
      return { id, type, imageUrl: "", points: [] };
    case "matching":
      return { id, type, pairs: [] };
  }
}

export function SlideBuilder({ slides, onChange }: { slides: LessonSlide[]; onChange: (slides: LessonSlide[]) => void }) {
  const t = useTranslations("dashboardTeacher.slideBuilder");
  const [expandedId, setExpandedId] = useState<string | null>(slides[0]?.id ?? null);

  function updateSlide(index: number, patch: Partial<LessonSlide>) {
    onChange(slides.map((s, i) => (i === index ? ({ ...s, ...patch } as LessonSlide) : s)));
  }

  function moveSlide(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function deleteSlide(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function addSlide(type: LessonSlideType) {
    const slide = emptySlide(type);
    onChange([...slides, slide]);
    setExpandedId(slide.id);
  }

  return (
    <div className="space-y-3">
      {slides.length === 0 && <p className="text-sm text-dim">{t("noSlides")}</p>}

      {slides.map((slide, index) => {
        const Icon = SLIDE_ICONS[slide.type];
        const expanded = expandedId === slide.id;
        return (
          <div key={slide.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon size={15} />
              </span>
              <button
                type="button"
                onClick={() => setExpandedId(expanded ? null : slide.id)}
                className="flex-1 cursor-pointer truncate text-start text-sm font-medium"
              >
                {index + 1}. {slide.title || t(`${slide.type}Slide`)}
              </button>
              <button
                type="button"
                onClick={() => moveSlide(index, -1)}
                disabled={index === 0}
                className="cursor-pointer text-dim disabled:opacity-30"
                aria-label={t("moveUp")}
              >
                <ArrowUp size={15} />
              </button>
              <button
                type="button"
                onClick={() => moveSlide(index, 1)}
                disabled={index === slides.length - 1}
                className="cursor-pointer text-dim disabled:opacity-30"
                aria-label={t("moveDown")}
              >
                <ArrowDown size={15} />
              </button>
              <button type="button" onClick={() => deleteSlide(index)} className="cursor-pointer text-danger" aria-label={t("deleteSlide")}>
                <Trash2 size={15} />
              </button>
            </div>

            {expanded && (
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <input
                  className={inputClasses}
                  placeholder={t("slideTitle")}
                  value={slide.title ?? ""}
                  onChange={(e) => updateSlide(index, { title: e.target.value })}
                />
                {slide.type === "text" && <TextSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
                {slide.type === "video" && <VideoSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
                {slide.type === "quiz" && <QuizSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
                {slide.type === "code" && <CodeSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
                {slide.type === "hotspot" && <HotspotSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
                {slide.type === "matching" && <MatchingSlideEditor slide={slide} onChange={(patch) => updateSlide(index, patch)} />}
              </div>
            )}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2">
        {SLIDE_TYPES.map((type) => {
          const Icon = SLIDE_ICONS[type];
          return (
            <button
              key={type}
              type="button"
              onClick={() => addSlide(type)}
              className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-strong px-3 py-1.5 text-xs text-body hover:border-accent/60 hover:text-accent"
            >
              <Plus size={13} /> <Icon size={13} /> {t(`${type}Slide`)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
