"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useStages } from "@/lib/hooks/useStages";
import { getStageSubjectsOverrides } from "@/lib/firebase/stages";
import { AdminStageSubjectsEditor } from "./AdminStageSubjectsEditor";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";
import type { StageId } from "@/types/stage";

export function AdminStagesView() {
  const staticStages = useStages();
  const t = useTranslations("dashboardAdmin.stages");

  // useStages() merges Firestore overrides asynchronously (zero-flicker for the
  // rest of the app), which would mount the editor below with stale, pre-edit
  // subjects for a moment. This view needs the real saved value present before
  // the editor's local state locks it in, so it waits for the fetch itself.
  const [overrides, setOverrides] = useState<Partial<Record<StageId, string[]>> | null>(null);

  useEffect(() => {
    getStageSubjectsOverrides().then(setOverrides);
  }, []);

  if (overrides === null) {
    return (
      <>
        <DashboardHeader title={t("title")} />
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      </>
    );
  }

  const stages = staticStages.map((s) => (overrides[s.id] ? { ...s, subjects: overrides[s.id]! } : s));

  return (
    <>
      <DashboardHeader title={t("title")} />
      <div className="space-y-4">
        {stages.map((stage) => (
          <AdminStageSubjectsEditor key={stage.id} stage={stage} />
        ))}
      </div>
    </>
  );
}
