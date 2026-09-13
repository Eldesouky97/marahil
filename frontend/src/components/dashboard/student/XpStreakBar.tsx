"use client";

import { useTranslations } from "next-intl";
import { Flame } from "lucide-react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import type { AppUser } from "@/types/user";

export function XpStreakBar({ profile }: { profile: AppUser | null }) {
  const t = useTranslations("dashboardStudent");
  const xp = profile?.xp ?? 0;
  const streak = profile?.streakCount ?? 0;
  const milestoneProgress = xp % 100;

  return (
    <div className="mb-8 flex flex-wrap items-center gap-6">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <ProgressRing
          value={milestoneProgress}
          size={56}
          strokeWidth={5}
          label={<span className="text-[10px] font-bold text-heading">{xp}</span>}
        />
      </div>
      <div>
        <p className="text-xs text-dim">{t("xpLabel")}</p>
        <p className="font-bold text-heading">{t("xpValue", { xp })}</p>
      </div>
      {streak > 0 && (
        <div className="flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-sm text-gold-ink">
          <Flame size={16} className="text-gold-strong" /> {t("streakValue", { count: streak })}
        </div>
      )}
    </div>
  );
}
