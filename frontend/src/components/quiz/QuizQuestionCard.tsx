import { useLocale } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types/quiz";

const ARABIC_LETTERS = ["أ", "ب", "ج", "د", "هـ", "و"];
const LATIN_LETTERS = ["A", "B", "C", "D", "E", "F"];

export function QuizQuestionCard({
  question,
  selected,
  onSelect,
}: {
  question: QuizQuestion;
  selected: number | null;
  onSelect: (index: number) => void;
}) {
  const locale = useLocale();
  const letters = locale === "ar" ? ARABIC_LETTERS : LATIN_LETTERS;

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
                "flex cursor-pointer items-center rounded-xl border border-border-strong bg-surface px-4 py-3.5 text-start text-sm transition-all hover:not-disabled:border-primary/35 disabled:cursor-default",
                state === "correct" && "border-accent/50 bg-accent/[0.15] text-accent-ink",
                state === "incorrect" && "border-danger/45 bg-danger/[0.12] text-danger-ink"
              )}
            >
              <span className="me-2 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border-strong text-xs font-bold">
                {letters[i] ?? String.fromCharCode(65 + i)}
              </span>
              {choice}
            </button>
          );
        })}
      </div>
    </div>
  );
}
