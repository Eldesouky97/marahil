"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { awardLessonCompletionRewards, incrementDailyActivity } from "@/lib/firebase/users";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { Button } from "@/components/ui/Button";
import type { QuizQuestion } from "@/types/quiz";

const PASS_THRESHOLD_PCT = 70;

/**
 * A course-wide self-assessment quiz — independent of any lesson, enrollment
 * progress, or certificate. A passing attempt awards the same flat XP as a
 * lesson completion (backend/firestore.rules caps this at +10/write
 * regardless of call site, so no rules change was needed for this).
 */
export function CourseQuickQuiz({ questions }: { questions: QuizQuestion[] }) {
  const { profile, refreshProfile } = useAuth();
  const [open, setOpen] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const t = useTranslations("courses");

  if (questions.length === 0) return null;

  async function handleComplete(score: number, total: number) {
    if (!profile || rewarded) return;
    const pct = Math.round((score / total) * 100);
    if (pct < PASS_THRESHOLD_PCT) return;
    setRewarded(true);
    await awardLessonCompletionRewards(profile.uid, profile.xp ?? 0, profile.streakCount ?? 0, profile.lastActiveDate);
    await incrementDailyActivity(profile.uid, new Date().toISOString().slice(0, 10));
    await refreshProfile();
  }

  return (
    <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      {open ? (
        <QuizPlayer questions={questions} onComplete={handleComplete} />
      ) : (
        <>
          <p className="mb-1 flex items-center gap-2 font-bold text-heading">
            <Zap size={18} className="text-primary-strong" /> {t("quickQuizTitle")}
          </p>
          <p className="mb-4 text-sm text-dim">{t("quickQuizSubtitle")}</p>
          <Button onClick={() => setOpen(true)}>{t("quickQuizCta")}</Button>
        </>
      )}
    </div>
  );
}
