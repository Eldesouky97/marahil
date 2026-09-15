"use client";

import { QuizBuilder } from "@/components/dashboard/teacher/QuizBuilder";
import type { QuizSlide } from "@/types/lessonSlide";

export function QuizSlideEditor({
  slide,
  onChange,
}: {
  slide: QuizSlide;
  onChange: (patch: Partial<QuizSlide>) => void;
}) {
  return <QuizBuilder questions={slide.questions} onChange={(questions) => onChange({ questions })} />;
}
