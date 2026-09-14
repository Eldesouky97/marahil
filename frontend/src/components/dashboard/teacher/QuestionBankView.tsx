"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Play } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useQuestionBank } from "@/lib/hooks/useQuestionBank";
import { addBankQuestion, deleteBankQuestion } from "@/lib/firebase/questionBank";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";

export function QuestionBankView() {
  const { profile } = useAuth();
  const { questions, loading, refresh } = useQuestionBank(profile?.uid);
  const t = useTranslations("dashboardTeacher.questionBank");

  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState(0);
  const [saving, setSaving] = useState(false);
  const [trial, setTrial] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!profile || !question.trim() || choices.some((c) => !c.trim())) return;
    setSaving(true);
    await addBankQuestion(profile.uid, { question, choices, correct });
    setQuestion("");
    setChoices(["", "", "", ""]);
    setCorrect(0);
    setSaving(false);
    refresh();
  }

  async function handleDelete(id: string) {
    await deleteBankQuestion(id);
    refresh();
  }

  if (trial) {
    return (
      <>
        <DashboardHeader title={t("trialTitle")} action={<Button variant="outline" onClick={() => setTrial(false)}>{t("backToBank")}</Button>} />
        <div className="rounded-2xl border border-border bg-surface-2 p-8">
          <QuizPlayer questions={questions} />
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader title={t("title")} />

      <form onSubmit={handleAdd} className="mb-8 space-y-4 rounded-xl border border-border bg-surface-2 p-5">
        <FormField label={t("questionLabel")}>
          <textarea
            className={inputClasses}
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={t("questionPlaceholder")}
          />
        </FormField>

        <p className="text-xs text-muted">{t("choicesHint")}</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {choices.map((c, i) => (
            <label key={i} className="flex items-center gap-2">
              <input type="radio" name="bank-correct" checked={correct === i} onChange={() => setCorrect(i)} />
              <input
                className={inputClasses}
                placeholder={t("choicePlaceholder", { n: i + 1 })}
                value={c}
                onChange={(e) => setChoices(choices.map((existing, idx) => (idx === i ? e.target.value : existing)))}
              />
            </label>
          ))}
        </div>

        <Button type="submit" disabled={saving} className="px-5 py-2.5 text-sm">
          <Plus size={16} /> {saving ? t("saving") : t("addQuestion")}
        </Button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-bold text-muted">{t("savedCount", { count: questions.length })}</span>
        {questions.length > 0 && (
          <Button variant="outline" className="px-4 py-2 text-sm" onClick={() => setTrial(true)}>
            <Play size={14} /> {t("runTrial")}
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : questions.length === 0 ? (
        <p className="text-dim">{t("empty")}</p>
      ) : (
        <div className="space-y-2">
          {questions.map((q) => (
            <div key={q.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
              <span className="truncate">{q.question}</span>
              <button
                type="button"
                onClick={() => handleDelete(q.id)}
                className="shrink-0 cursor-pointer text-danger"
                aria-label={t("deleteQuestion")}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
