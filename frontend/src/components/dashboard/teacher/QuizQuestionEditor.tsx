"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormField";
import type { QuizQuestion } from "@/types/quiz";

export function QuizQuestionEditor({
  question,
  index,
  onChange,
  onDelete,
}: {
  question: QuizQuestion;
  index: number;
  onChange: (patch: Partial<QuizQuestion>) => void;
  onDelete: () => void;
}) {
  const t = useTranslations("dashboardTeacher.quizBuilder");

  function updateChoice(cIndex: number, value: string) {
    const choices = [...question.choices];
    choices[cIndex] = value;
    onChange({ choices });
  }

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs text-dim">{t("questionLabel", { n: index + 1 })}</span>
        <button type="button" onClick={onDelete} className="cursor-pointer text-danger" aria-label={t("deleteQuestion")}>
          <Trash2 size={15} />
        </button>
      </div>

      <input
        className={`${inputClasses} mb-3`}
        placeholder={t("questionPlaceholder")}
        value={question.question}
        onChange={(e) => onChange({ question: e.target.value })}
      />

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {question.choices.map((choice, cIndex) => (
          <label key={cIndex} className="flex items-center gap-2">
            <input
              type="radio"
              name={`correct-${question.id}`}
              checked={question.correct === cIndex}
              onChange={() => onChange({ correct: cIndex })}
            />
            <input
              className={inputClasses}
              placeholder={t("choicePlaceholder", { n: cIndex + 1 })}
              value={choice}
              onChange={(e) => updateChoice(cIndex, e.target.value)}
            />
          </label>
        ))}
      </div>

      <input
        className={`${inputClasses} mt-3`}
        placeholder={t("explanationPlaceholder")}
        value={question.explanation}
        onChange={(e) => onChange({ explanation: e.target.value })}
      />
    </div>
  );
}
