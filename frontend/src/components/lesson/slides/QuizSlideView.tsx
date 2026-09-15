import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import type { QuizSlide } from "@/types/lessonSlide";

/**
 * Thin wrapper, no onComplete — this is a self-check slide, not the lesson's
 * graded quiz. Deliberately no Firestore write and no XP here (unlike the
 * course-level quick quiz) so stacking quiz slides in one lesson can't be
 * used to farm XP.
 */
export function QuizSlideView({ slide }: { slide: QuizSlide }) {
  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}
      <QuizPlayer questions={slide.questions} />
    </div>
  );
}
