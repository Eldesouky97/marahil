"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useStageLabel } from "@/lib/hooks/useStages";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import type { ContinueLearningData } from "@/lib/hooks/useContinueLearning";

export function ContinueLearningCard({ data }: { data: ContinueLearningData }) {
  const stageLabel = useStageLabel();
  const t = useTranslations("dashboardStudent");
  const { course, enrollment, nextLessonId, loading } = data;
  const href = nextLessonId ? `/learn/${course.id}/${nextLessonId}` : `/courses/${course.id}`;

  return (
    <Link
      href={href}
      className="mb-8 block rounded-2xl border border-border bg-surface-2 p-6 transition-colors hover:border-primary/30"
    >
      <p className="mb-3 text-xs font-bold text-accent">{t("continueLearning")}</p>
      <div className="flex items-center gap-4">
        {course.coverImageUrl ? (
          <Image
            src={course.coverImageUrl}
            alt=""
            width={72}
            height={72}
            className="h-16 w-16 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <BookOpen size={24} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <span className="mb-1 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary-strong">
            {stageLabel(course.stage)}
          </span>
          <h3 className="truncate font-bold text-heading">{course.title}</h3>
          <div className="mt-2">
            <ProgressBar value={enrollment.progress} />
          </div>
        </div>
        <Button className="shrink-0 px-5 py-2 text-sm" disabled={loading}>
          {t("resume")}
        </Button>
      </div>
    </Link>
  );
}
