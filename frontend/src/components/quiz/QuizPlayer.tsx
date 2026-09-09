"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Award } from "lucide-react";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types/quiz";

export function QuizPlayer({
  questions,
  onComplete,
}: {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
}) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const t = useTranslations("quiz");

  const question = questions[step];

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correct) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setSelected(null);
    } else {
      setFinished(true);
      onComplete?.(score, questions.length);
    }
  }

  function restart() {
    setStep(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="py-6 text-center">
        <Award size={36} className="mx-auto mb-4 text-primary" />
        <h3 className="mb-2 font-display text-2xl text-heading">
          {t("resultTitle", { score, total: questions.length })}
        </h3>
        <p className="mb-6 text-dim">{t("resultSubtitle")}</p>
        <Button variant="outline" onClick={restart}>
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs text-dim">{t("questionCounter", { n: step + 1, total: questions.length })}</span>
        <div className="flex items-center gap-1.5">
          {questions.map((_, i) => (
            <span
              key={i}
              className={cn(
                "inline-block h-2 w-2 rounded-full bg-overlay",
                i === step && "bg-primary",
                i < step && "bg-accent"
              )}
            />
          ))}
        </div>
      </div>

      <QuizQuestionCard question={question} selected={selected} onSelect={choose} />

      {selected !== null && (
        <div className="mt-5 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className={cn("text-sm", selected === question.correct ? "text-accent" : "text-primary")}>
            {selected === question.correct ? t("correct") : t("incorrect")}
            {question.explanation ? ` — ${question.explanation}` : ""}
          </p>
          <Button onClick={next} className="px-6 py-2.5 text-sm">
            {step + 1 < questions.length ? t("next") : t("seeResult")}
          </Button>
        </div>
      )}
    </div>
  );
}
