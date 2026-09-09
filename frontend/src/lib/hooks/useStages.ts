"use client";

import { useTranslations } from "next-intl";
import { STAGE_IDS } from "@/data/stages";
import type { Stage, StageId } from "@/types/stage";

export function useStages(): Stage[] {
  const t = useTranslations("stages");
  return STAGE_IDS.map((id) => ({
    id,
    label: t(`${id}.label`),
    subjects: t.raw(`${id}.subjects`) as string[],
  }));
}

export function useStageLabel() {
  const t = useTranslations("stages");
  return (id: StageId | string) => t(`${id}.label`);
}
