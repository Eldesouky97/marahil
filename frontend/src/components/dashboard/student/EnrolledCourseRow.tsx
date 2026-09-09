"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useStageLabel } from "@/lib/hooks/useStages";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { EnrolledCourse } from "@/lib/hooks/useStudentDashboard";

export function EnrolledCourseRow({ item }: { item: EnrolledCourse }) {
  const stageLabel = useStageLabel();
  const t = useTranslations("dashboardStudent");

  return (
    <Link
      href={`/courses/${item.course.id}`}
      className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/30"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{item.course.title}</span>
        <span className="text-xs text-dim">{stageLabel(item.course.stage)}</span>
      </div>
      <ProgressBar value={item.enrollment.progress} />
      <div className="mt-2 text-xs text-dim">{t("progressComplete", { progress: item.enrollment.progress })}</div>
    </Link>
  );
}
