"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormField";
import type { QuizQuestion } from "@/types/quiz";

function emptyQuestion(): QuizQuestion {
  return { id: crypto.randomUUID(), question: "", choices: ["", "", "", ""], correct: 0, explanation: "" };
}

export function QuizBuilder({
  questions,
  onChange,
}: {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}) {
  const t = useTranslations("dashboardTeacher.quizBuilder");

  function updateQuestion(index: number, patch: Partial<QuizQuestion>) {
    onChange(questions.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateChoice(qIndex: number, cIndex: number, value: string) {
    const choices = [...questions[qIndex].choices];
    choices[cIndex] = value;
    updateQuestion(qIndex, { choices });
  }

  return (
    <div className="space-y-5">
      {questions.map((q, qIndex) => (
        <div key={q.id} className="rounded-xl border border-border bg-surface-2 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-dim">{t("questionLabel", { n: qIndex + 1 })}</span>
            <button
              type="button"
              onClick={() => onChange(questions.filter((_, i) => i !== qIndex))}
              className="cursor-pointer text-danger"
              aria-label={t("deleteQuestion")}
            >
              <Trash2 size={15} />
            </button>
          </div>

          <input
            className={`${inputClasses} mb-3`}
            placeholder={t("questionPlaceholder")}
            value={q.question}
            onChange={(e) => updateQuestion(qIndex, { question: e.target.value })}
          />

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {q.choices.map((choice, cIndex) => (
              <label key={cIndex} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${q.id}`}
                  checked={q.correct === cIndex}
                  onChange={() => updateQuestion(qIndex, { correct: cIndex })}
                />
                <input
                  className={inputClasses}
                  placeholder={t("choicePlaceholder", { n: cIndex + 1 })}
                  value={choice}
                  onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                />
              </label>
            ))}
          </div>

          <input
            className={`${inputClasses} mt-3`}
            placeholder={t("explanationPlaceholder")}
            value={q.explanation}
            onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, emptyQuestion()])}
        className="flex cursor-pointer items-center gap-2 text-sm text-accent"
      >
        <Plus size={15} /> {t("addQuestion")}
      </button>
    </div>
  );
}
