"use client";

import { useTranslations } from "next-intl";
import { FileText, Download } from "lucide-react";
import type { CourseMaterial } from "@/types/course";

export function CourseMaterialsPanel({ materials }: { materials: CourseMaterial[] }) {
  const t = useTranslations("courses");

  if (materials.length === 0) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface-2 p-6">
      <h3 className="mb-4 text-sm font-bold">{t("materialsTitle")}</h3>
      <div className="space-y-2">
        {materials.map((m, i) => (
          <a
            key={`${m.url}-${i}`}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:border-accent/60"
          >
            <span className="flex min-w-0 items-center gap-2">
              <FileText size={15} className="shrink-0 text-dim" />
              <span className="truncate">{m.name}</span>
            </span>
            <Download size={14} className="shrink-0 text-dim" />
          </a>
        ))}
      </div>
    </div>
  );
}
