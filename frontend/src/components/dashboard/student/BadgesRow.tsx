"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { useBadges, type BadgeContext } from "@/lib/hooks/useBadges";

export function BadgesRow({ profile, enrolledCourses, certificates }: BadgeContext) {
  const badges = useBadges({ profile, enrolledCourses, certificates });
  const t = useTranslations("badges");

  return (
    <div className="mb-8 flex flex-wrap gap-3">
      {badges.map((b) => (
        <div
          key={b.id}
          title={t(b.id)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs",
            b.earned ? "border-gold/40 bg-gold/10 text-gold-ink" : "border-border bg-surface-2 text-faint opacity-50"
          )}
        >
          <b.icon size={14} /> {t(b.id)}
        </div>
      ))}
    </div>
  );
}
