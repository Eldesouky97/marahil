"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Share2, Star } from "lucide-react";
import confetti from "canvas-confetti";
import { QuizQuestionCard } from "./QuizQuestionCard";
import { Button } from "@/components/ui/Button";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { useToast } from "@/components/ui/ToastProvider";
import { cn } from "@/lib/utils/cn";
import type { QuizQuestion } from "@/types/quiz";

const QUESTION_SECONDS = 20;
const PASS_THRESHOLD_PCT = 70;

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
  const [timeLeft, setTimeLeft] = useState(QUESTION_SECONDS);
  const [copied, setCopied] = useState(false);
  const celebrated = useRef(false);
  const t = useTranslations("quiz");
  const { showToast } = useToast();

  const question = questions[step];
  const pct = Math.round((score / questions.length) * 100);
  const stars = pct >= 80 ? 3 : pct >= 50 ? 2 : 1;

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correct) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 < questions.length) {
      setStep(step + 1);
      setSelected(null);
      setTimeLeft(QUESTION_SECONDS);
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
    setCopied(false);
    setTimeLeft(QUESTION_SECONDS);
    celebrated.current = false;
  }

  async function handleShare() {
    const text = t("shareText", { score, total: questions.length, pct });
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t("shareSuccessToast"), { tone: "success" });
    } catch {
      showToast(t("shareErrorToast"), { tone: "error" });
    }
  }

  useEffect(() => {
    if (selected !== null || finished) return;
    const id = setTimeout(() => {
      if (timeLeft <= 1) {
        choose(-1);
      } else {
        setTimeLeft((s) => s - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, selected, finished, step]);

  useEffect(() => {
    if (!finished || celebrated.current) return;
    celebrated.current = true;
    if (pct < PASS_THRESHOLD_PCT) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const style = getComputedStyle(document.documentElement);
    const colors = [style.getPropertyValue("--gold"), style.getPropertyValue("--accent"), style.getPropertyValue("--primary")]
      .map((c) => c.trim())
      .filter(Boolean);

    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors, startVelocity: 45 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  if (finished) {
    return (
      <div className="py-6 text-center">
        <div className="relative mx-auto mb-4 h-28 w-28">
          <ProgressRing value={pct} size={112} strokeWidth={9} label={<span className="font-display text-2xl text-heading">{pct}%</span>} />
        </div>
        <div className="mb-3 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <Star key={i} size={18} className={i < stars ? "fill-gold text-gold" : "fill-none text-border"} />
          ))}
        </div>
        <h3 className="mb-2 font-display text-2xl text-heading">{t("resultTitle", { score, total: questions.length })}</h3>
        <p className="mb-6 text-dim">{t("resultSubtitle")}</p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button variant="outline" onClick={restart}>
            {t("retry")}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            {copied ? (
              t("copied")
            ) : (
              <>
                <Share2 size={16} /> {t("share")}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 h-1 w-full overflow-hidden rounded-full bg-overlay">
        <div
          className={cn("h-full rounded-full transition-[width] duration-1000 linear", timeLeft <= 5 ? "bg-danger" : "bg-primary")}
          style={{ width: `${(timeLeft / QUESTION_SECONDS) * 100}%` }}
        />
      </div>

      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs text-dim">{t("questionCounter", { n: step + 1, total: questions.length })}</span>
        <div className="flex items-center gap-3">
          <span className={cn("text-xs", timeLeft <= 5 ? "text-danger" : "text-dim")}>{timeLeft}s</span>
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
