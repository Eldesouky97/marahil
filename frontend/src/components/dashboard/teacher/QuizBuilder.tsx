"use client";

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
        <div key={q.id} className="rounded-xl border border-white/10 bg-[#0F1729] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-[#8A93A6]">سؤال {qIndex + 1}</span>
            <button
              type="button"
              onClick={() => onChange(questions.filter((_, i) => i !== qIndex))}
              className="cursor-pointer text-[#E86B6B]"
              aria-label="حذف السؤال"
            >
              <Trash2 size={15} />
            </button>
          </div>

          <input
            className={`${inputClasses} mb-3`}
            placeholder="نص السؤال"
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
                  placeholder={`اختيار ${cIndex + 1}`}
                  value={choice}
                  onChange={(e) => updateChoice(qIndex, cIndex, e.target.value)}
                />
              </label>
            ))}
          </div>

          <input
            className={`${inputClasses} mt-3`}
            placeholder="تفسير الإجابة (اختياري)"
            value={q.explanation}
            onChange={(e) => updateQuestion(qIndex, { explanation: e.target.value })}
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...questions, emptyQuestion()])}
        className="flex cursor-pointer items-center gap-2 text-sm text-[#3FBFAE]"
      >
        <Plus size={15} /> أضف سؤالًا
      </button>
    </div>
  );
}
