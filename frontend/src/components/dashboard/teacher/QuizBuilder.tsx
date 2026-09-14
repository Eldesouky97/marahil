"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Download, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useQuestionBank } from "@/lib/hooks/useQuestionBank";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { inputClasses } from "@/components/ui/FormField";
import type { QuizQuestion } from "@/types/quiz";

function emptyQuestion(): QuizQuestion {
  return { id: crypto.randomUUID(), question: "", choices: ["", "", "", ""], correct: 0, explanation: "" };
}

function ImportFromBankPicker({
  onImport,
  onClose,
}: {
  onImport: (questions: QuizQuestion[]) => void;
  onClose: () => void;
}) {
  const { profile } = useAuth();
  const { questions: bank } = useQuestionBank(profile?.uid);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const t = useTranslations("dashboardTeacher.quizBuilder");

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Modal open onClose={onClose} title={t("importPickerTitle")}>
      {bank.length === 0 ? (
        <p className="text-sm text-dim">{t("importPickerEmpty")}</p>
      ) : (
        <div className="max-h-80 space-y-2 overflow-y-auto">
          {bank.map((q) => (
            <label key={q.id} className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm">
              <input type="checkbox" checked={selected.has(q.id)} onChange={() => toggle(q.id)} />
              <span className="truncate">{q.question}</span>
            </label>
          ))}
        </div>
      )}
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="outline" className="px-4 py-2 text-sm" onClick={onClose}>
          {t("cancel")}
        </Button>
        <Button
          className="px-4 py-2 text-sm"
          disabled={selected.size === 0}
          onClick={() => {
            const imported = bank
              .filter((q) => selected.has(q.id))
              .map((q) => ({ id: crypto.randomUUID(), question: q.question, choices: q.choices, correct: q.correct, explanation: q.explanation }));
            onImport(imported);
            onClose();
          }}
        >
          {t("importSelected", { count: selected.size })}
        </Button>
      </div>
    </Modal>
  );
}

export function QuizBuilder({
  questions,
  onChange,
}: {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}) {
  const t = useTranslations("dashboardTeacher.quizBuilder");
  const [importing, setImporting] = useState(false);

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

      <div className="flex flex-wrap gap-4">
        <button
          type="button"
          onClick={() => onChange([...questions, emptyQuestion()])}
          className="flex cursor-pointer items-center gap-2 text-sm text-accent"
        >
          <Plus size={15} /> {t("addQuestion")}
        </button>
        <button
          type="button"
          onClick={() => setImporting(true)}
          className="flex cursor-pointer items-center gap-2 text-sm text-primary-strong"
        >
          <Download size={15} /> {t("importFromBank")}
        </button>
      </div>

      {importing && (
        <ImportFromBankPicker
          onImport={(imported) => onChange([...questions, ...imported])}
          onClose={() => setImporting(false)}
        />
      )}
    </div>
  );
}
