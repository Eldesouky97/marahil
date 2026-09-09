import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types/quiz";

export function QuizQuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  return (
    <div>
      <h3 className="mb-6 text-lg font-bold">{question.question}</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {question.choices.map((choice, i) => {
          let state = "";
          if (selected !== null) {
            if (i === question.correct) state = "correct";
            else if (i === selected) state = "incorrect";
          }
          return (
            <button
              key={i}
              onClick={() => onSelect(i)}
              disabled={selected !== null}
              className={cn(
                "cursor-pointer rounded-xl border border-white/[0.08] bg-[#141F38] px-4 py-3.5 text-right text-sm transition-all hover:not-disabled:border-[#D4A94F]/35 disabled:cursor-default",
                state === "correct" && "border-[#3FBFAE]/50 bg-[#3FBFAE]/[0.15] text-[#BFF3EA]",
                state === "incorrect" && "border-[#E86B6B]/45 bg-[#E86B6B]/[0.12] text-[#F3BFBF]"
              )}
            >
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
