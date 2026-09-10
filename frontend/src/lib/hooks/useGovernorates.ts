"use client";

import { useTranslations } from "next-intl";
import { GOVERNORATE_IDS } from "@/data/governorates";
import type { Governorate, GovernorateId } from "@/types/governorate";

export function useGovernorates(): Governorate[] {
  const t = useTranslations("governorates");
  return GOVERNORATE_IDS.map((id) => ({ id, label: t(id) }));
}

/** For displaying a stored governorate id as its label (admin user details, CSV export) — falls back to the raw value for pre-existing free-text data written before this was a dropdown. */
export function useGovernorateLabel() {
  const t = useTranslations("governorates");
  return (id: string) => (GOVERNORATE_IDS.includes(id as GovernorateId) ? t(id as GovernorateId) : id);
}
