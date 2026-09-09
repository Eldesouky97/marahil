"use client";

import { useTranslations } from "next-intl";
import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/Container";
import type { QuizQuestion } from "@/types/quiz";

export function InteractiveDemo() {
  const t = useTranslations("demo");
  const rawQuestions = t.raw("questions") as Omit<QuizQuestion, "id">[];
  const questions: QuizQuestion[] = rawQuestions.map((q, i) => ({ id: String(i), ...q }));

  return (
    <section id="demo" className="border-b border-border bg-bg py-24">
      <Container size="lg">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <div className="rounded-2xl border border-border bg-surface-2 p-8">
          <QuizPlayer questions={questions} />
        </div>
      </Container>
    </section>
  );
}
