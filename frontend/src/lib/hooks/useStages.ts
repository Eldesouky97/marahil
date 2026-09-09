"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { STAGE_IDS } from "@/data/stages";
import { getStageSubjectsOverrides } from "@/lib/firebase/stages";
import type { Stage, StageId } from "@/types/stage";

export function useStages(): Stage[] {
  const t = useTranslations("stages");
  const [overrides, setOverrides] = useState<Partial<Record<StageId, string[]>>>({});

  useEffect(() => {
    let cancelled = false;
    getStageSubjectsOverrides().then((result) => {
      if (!cancelled) setOverrides(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return STAGE_IDS.map((id) => ({
    id,
    label: t(`${id}.label`),
    subjects: overrides[id] ?? (t.raw(`${id}.subjects`) as string[]),
  }));
}

export function useStageLabel() {
  const t = useTranslations("stages");
  return (id: StageId | string) => t(`${id}.label`);
}
