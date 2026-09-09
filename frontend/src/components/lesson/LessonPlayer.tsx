"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useLessonPlayer } from "@/lib/hooks/useLessonPlayer";
import { LessonContent } from "./LessonContent";
import { CertificateEarnedBanner } from "./CertificateEarnedBanner";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function LessonPlayer({ courseId, lessonId }: { courseId: string; lessonId: string }) {
  const { profile } = useAuth();
  const { course, lesson, lessons, enrollment, loading, certificateId, completeLesson } =
    useLessonPlayer(courseId, lessonId, profile?.uid, profile?.name);
  const [marking, setMarking] = useState(false);
  const t = useTranslations("lesson");

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!course || !lesson) {
    return <p className="py-24 text-center text-dim">{t("notFound")}</p>;
  }

  const alreadyDone = enrollment?.completedLessonIds.includes(lesson.id) ?? false;
  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const nextLesson = lessons[currentIndex + 1];

  async function markComplete() {
    setMarking(true);
    await completeLesson(null);
    setMarking(false);
  }

  return (
    <section className="py-16">
      <Container size="lg">
        <Link
          href={`/courses/${course.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm text-dim hover:text-primary-strong"
        >
          <ArrowLeft size={16} className="ltr:rotate-180" /> {t("backToCourse")}
        </Link>

        <h1 className="mb-6 font-display text-2xl text-heading">{lesson.title}</h1>

        <LessonContent lesson={lesson} />

        {lesson.quiz && lesson.quiz.length > 0 ? (
          <div className="mt-8 rounded-2xl border border-border bg-surface-2 p-8">
            <QuizPlayer
              questions={lesson.quiz}
              onComplete={(score, total) => completeLesson(Math.round((score / total) * 100))}
            />
          </div>
        ) : (
          !alreadyDone && (
            <Button className="mt-8" onClick={markComplete} disabled={marking}>
              {marking ? t("markCompleteLoading") : t("markComplete")}
            </Button>
          )
        )}

        {certificateId && <CertificateEarnedBanner certificateId={certificateId} />}

        {nextLesson && (alreadyDone || certificateId) && (
          <Link href={`/learn/${course.id}/${nextLesson.id}`} className="mt-6 block">
            <Button variant="outline">{t("nextLesson")}</Button>
          </Link>
        )}
      </Container>
    </section>
  );
}
