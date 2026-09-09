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
                "cursor-pointer rounded-xl border border-border-strong bg-surface px-4 py-3.5 text-start text-sm transition-all hover:not-disabled:border-primary/35 disabled:cursor-default",
                state === "correct" && "border-accent/50 bg-accent/[0.15] text-accent-ink",
                state === "incorrect" && "border-danger/45 bg-danger/[0.12] text-danger-ink"
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
