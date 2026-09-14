"use client";

import { useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { ChartConfiguration } from "chart.js/auto";
import { useTheme } from "@/context/ThemeProvider";
import { useWeeklyActivity } from "@/lib/hooks/useWeeklyActivity";
import { getChartColors } from "@/lib/utils/chartColors";
import { AdminChart } from "@/components/dashboard/admin/AdminChart";

export function WeeklyActivityChart({ uid }: { uid: string | undefined }) {
  const { theme } = useTheme();
  const locale = useLocale();
  const { days, total } = useWeeklyActivity(uid);
  const t = useTranslations("dashboardStudent");

  const config: ChartConfiguration | null = useMemo(() => {
    if (typeof window === "undefined" || days.length === 0) return null;
    const colors = getChartColors();
    const formatter = new Intl.DateTimeFormat(locale, { weekday: "short" });
    return {
      type: "bar",
      data: {
        labels: days.map((d) => formatter.format(new Date(`${d.date}T00:00:00`))),
        datasets: [
          {
            data: days.map((d) => d.count),
            backgroundColor: colors.series[0],
            borderRadius: 6,
            maxBarThickness: 28,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0, color: colors.text }, grid: { color: colors.grid } },
          x: { ticks: { color: colors.text }, grid: { display: false } },
        },
      },
    };
  }, [days, locale]);

  if (!uid) return null;

  return (
    <div className="panel mb-8 rounded-2xl border border-border bg-surface p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold">{t("weeklyActivityTitle")}</h3>
        <span className="text-xs text-dim">{t("weeklyActivityTotal", { count: total })}</span>
      </div>
      <div className="h-52">{config && <AdminChart key={theme} config={config} />}</div>
    </div>
  );
}
