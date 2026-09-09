"use client";

import { useTranslations } from "next-intl";
import { useStages } from "@/lib/hooks/useStages";
import { cn } from "@/lib/utils/cn";
import type { StageId } from "@/types/stage";

export function StageFilter({
  value,
  onChange,
}: {
  value: StageId | "all";
  onChange: (stage: StageId | "all") => void;
}) {
  const stages = useStages();
  const t = useTranslations("stages");

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "cursor-pointer rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-dim transition-all hover:border-primary/30",
          value === "all" && "border-transparent bg-gradient-to-l from-primary to-primary-strong text-primary-ink"
        )}
      >
        {t("all")}
      </button>
      {stages.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          className={cn(
            "cursor-pointer rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-dim transition-all hover:border-primary/30",
            value === s.id && "border-transparent bg-gradient-to-l from-primary to-primary-strong text-primary-ink"
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
