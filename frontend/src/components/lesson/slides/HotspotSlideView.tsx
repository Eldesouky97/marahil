"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import type { HotspotSlide } from "@/types/lessonSlide";

export function HotspotSlideView({ slide }: { slide: HotspotSlide }) {
  const t = useTranslations("lesson.slideDeck");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (!openId) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpenId(null);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [openId]);

  const openPoint = slide.points.find((p) => p.id === openId);

  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}
      <div className="relative inline-block max-w-full">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary R2 URL; hotspot dots are positioned relative to the raw rendered box */}
        <img src={slide.imageUrl} alt="" className="max-w-full rounded-xl border border-border" />
        {slide.points.map((point, i) => (
          <button
            key={point.id}
            type="button"
            onClick={() => setOpenId(openId === point.id ? null : point.id)}
            style={{ left: `${point.xPct}%`, top: `${point.yPct}%` }}
            className="absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-ink shadow-md transition-transform hover:scale-110"
            aria-label={point.label}
          >
            {i + 1}
          </button>
        ))}

        {openPoint && (
          <div
            className="absolute z-10 w-56 -translate-x-1/2 rounded-xl border border-border bg-surface p-3 shadow-xl"
            style={{ left: `${openPoint.xPct}%`, top: `calc(${openPoint.yPct}% + 22px)` }}
          >
            <div className="mb-1 flex items-start justify-between gap-2">
              <h4 className="text-sm font-bold text-heading">{openPoint.label}</h4>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label={t("hotspotClose")}
                className="shrink-0 cursor-pointer text-dim hover:text-heading"
              >
                <X size={14} />
              </button>
            </div>
            {openPoint.description && <p className="text-xs text-dim">{openPoint.description}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
