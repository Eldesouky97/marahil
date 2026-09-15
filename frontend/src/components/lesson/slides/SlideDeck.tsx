"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TextSlideView } from "./TextSlideView";
import { VideoSlideView } from "./VideoSlideView";
import { QuizSlideView } from "./QuizSlideView";
import { CodeSlideView } from "./CodeSlideView";
import { HotspotSlideView } from "./HotspotSlideView";
import { MatchingSlideView } from "./MatchingSlideView";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { LessonSlide } from "@/types/lessonSlide";

export function SlideDeck({ slides, onDeckComplete }: { slides: LessonSlide[]; onDeckComplete: () => void }) {
  const t = useTranslations("lesson.slideDeck");
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const isLast = index === slides.length - 1;
  // The matching slide has its own native HTML5 drag-and-drop on child elements —
  // a swipe-drag wrapper around it would fight that, so swipe is disabled there.
  const swipeEnabled = slide.type !== "matching";

  function go(delta: number) {
    setIndex((i) => Math.min(Math.max(i + delta, 0), slides.length - 1));
  }

  function handleNext() {
    if (isLast) onDeckComplete();
    else go(1);
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-dim">{t("slideCounter", { current: index + 1, total: slides.length })}</span>
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-5 bg-primary" : i < index ? "w-1.5 bg-accent" : "w-1.5 bg-overlay"
              )}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-surface-2 p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            drag={swipeEnabled ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) handleNext();
              else if (info.offset.x > 80) go(-1);
            }}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            {slide.type === "text" && <TextSlideView slide={slide} />}
            {slide.type === "video" && <VideoSlideView slide={slide} />}
            {slide.type === "quiz" && <QuizSlideView slide={slide} />}
            {slide.type === "code" && <CodeSlideView slide={slide} />}
            {slide.type === "hotspot" && <HotspotSlideView slide={slide} />}
            {slide.type === "matching" && <MatchingSlideView slide={slide} />}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="flex cursor-pointer items-center gap-1.5 text-sm text-dim hover:text-primary-strong disabled:cursor-not-allowed disabled:opacity-30"
        >
          <ChevronRight size={16} className="ltr:rotate-180" /> {t("previous")}
        </button>
        <Button onClick={handleNext} className="px-6 py-2.5 text-sm">
          {isLast ? t("finish") : t("next")}
          {!isLast && <ChevronLeft size={16} className="ltr:rotate-180" />}
        </Button>
      </div>
    </div>
  );
}
