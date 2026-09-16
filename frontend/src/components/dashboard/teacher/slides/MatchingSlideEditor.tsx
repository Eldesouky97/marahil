"use client";

import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import { inputClasses } from "@/components/ui/FormField";
import type { MatchingSlide, MatchingPair } from "@/types/lessonSlide";

export function MatchingSlideEditor({
  slide,
  onChange,
}: {
  slide: MatchingSlide;
  onChange: (patch: Partial<MatchingSlide>) => void;
}) {
  const t = useTranslations("dashboardTeacher.slideBuilder");

  function updatePair(index: number, patch: Partial<MatchingPair>) {
    onChange({ pairs: slide.pairs.map((p, i) => (i === index ? { ...p, ...patch } : p)) });
  }

  function deletePair(index: number) {
    onChange({ pairs: slide.pairs.filter((_, i) => i !== index) });
  }

  function addPair() {
    onChange({ pairs: [...slide.pairs, { id: crypto.randomUUID(), left: "", right: "" }] });
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-dim">{t("matchingPairs")}</p>
      {slide.pairs.map((pair, index) => (
        <div key={pair.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            className={`${inputClasses} min-w-0`}
            placeholder={t("matchingLeft")}
            value={pair.left}
            onChange={(e) => updatePair(index, { left: e.target.value })}
          />
          <input
            className={`${inputClasses} min-w-0`}
            placeholder={t("matchingRight")}
            value={pair.right}
            onChange={(e) => updatePair(index, { right: e.target.value })}
          />
          <button
            type="button"
            onClick={() => deletePair(index)}
            className="flex shrink-0 cursor-pointer justify-end text-danger sm:justify-start"
            aria-label={t("deletePair")}
          >
            <Trash2 size={15} />
          </button>
        </div>
      ))}
      <button type="button" onClick={addPair} className="flex cursor-pointer items-center gap-2 text-sm text-accent">
        <Plus size={15} /> {t("addPair")}
      </button>
    </div>
  );
}
