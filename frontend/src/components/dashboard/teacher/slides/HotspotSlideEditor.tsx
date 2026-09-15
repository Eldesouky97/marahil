"use client";

import { useTranslations } from "next-intl";
import { Trash2 } from "lucide-react";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { ImageUploadField } from "@/components/ui/ImageUploadField";
import type { HotspotSlide, HotspotPoint } from "@/types/lessonSlide";

export function HotspotSlideEditor({
  slide,
  onChange,
}: {
  slide: HotspotSlide;
  onChange: (patch: Partial<HotspotSlide>) => void;
}) {
  const t = useTranslations("dashboardTeacher.slideBuilder");

  function handleImageClick(e: React.MouseEvent<HTMLImageElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const point: HotspotPoint = { id: crypto.randomUUID(), xPct, yPct, label: "" };
    onChange({ points: [...slide.points, point] });
  }

  function updatePoint(index: number, patch: Partial<HotspotPoint>) {
    onChange({ points: slide.points.map((p, i) => (i === index ? { ...p, ...patch } : p)) });
  }

  function deletePoint(index: number) {
    onChange({ points: slide.points.filter((_, i) => i !== index) });
  }

  return (
    <>
      <FormField label={t("hotspotImage")}>
        <ImageUploadField folder="lesson-images" currentUrl={slide.imageUrl} onUploaded={(url) => onChange({ imageUrl: url })} />
      </FormField>

      {slide.imageUrl && (
        <div className="space-y-2">
          <p className="text-xs text-dim">{t("hotspotHint")}</p>
          <div className="relative inline-block max-w-full">
            {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary R2 URL; click coordinates need the raw rendered <img> box */}
            <img
              src={slide.imageUrl}
              alt=""
              onClick={handleImageClick}
              className="max-h-64 max-w-full cursor-crosshair rounded-lg"
            />
            {slide.points.map((point) => (
              <span
                key={point.id}
                className="absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-primary-ink"
                style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {slide.points.map((point, index) => (
          <div key={point.id} className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-dim">#{index + 1}</span>
              <button type="button" onClick={() => deletePoint(index)} className="cursor-pointer text-danger" aria-label={t("deletePoint")}>
                <Trash2 size={14} />
              </button>
            </div>
            <input
              className={`${inputClasses} mb-2`}
              placeholder={t("hotspotLabel")}
              value={point.label}
              onChange={(e) => updatePoint(index, { label: e.target.value })}
            />
            <input
              className={inputClasses}
              placeholder={t("hotspotDescription")}
              value={point.description ?? ""}
              onChange={(e) => updatePoint(index, { description: e.target.value })}
            />
          </div>
        ))}
      </div>
    </>
  );
}
