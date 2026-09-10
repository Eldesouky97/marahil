"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award, BookOpen, CheckCircle2, Clock, GraduationCap, UserCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useTheme } from "@/context/ThemeProvider";
import { useAdminOverview } from "@/lib/hooks/useAdminOverview";
import { useAdminTrends } from "@/lib/hooks/useAdminTrends";
import { useAdminUsers } from "@/lib/hooks/useAdminUsers";
import { useAdminAuditLog } from "@/lib/hooks/useAdminAuditLog";
import { getChartColors } from "@/lib/utils/chartColors";
import { AdminChart } from "./AdminChart";
import { AdminRecentUserRow } from "./AdminRecentUserRow";
import { AdminAuditLogRow } from "./AdminAuditLogRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Spinner } from "@/components/ui/Spinner";
import type { ChartConfiguration } from "chart.js/auto";

export function AdminOverviewView() {
  const { profile } = useAuth();
  const { theme } = useTheme();
  const overview = useAdminOverview();
  const trends = useAdminTrends();
  const { users } = useAdminUsers();
  const { entries } = useAdminAuditLog();
  const t = useTranslations("dashboardAdmin.overview");
  const tShared = useTranslations("dashboardShared");
  const tAuditLog = useTranslations("dashboardAdmin.auditLog");

  const recentUsers = useMemo(
    () => [...users].sort((a, b) => b.createdAt - a.createdAt).slice(0, 5),
    [users]
  );
  const recentActivity = entries.slice(0, 5);

  const lineConfig: ChartConfiguration | null = useMemo(() => {
    if (typeof window === "undefined" || trends.signupsByMonth.length === 0) return null;
    const colors = getChartColors();
    return {
      type: "line",
      data: {
        labels: trends.signupsByMonth.map((m) => m.label),
        datasets: [
          {
            data: trends.signupsByMonth.map((m) => m.count),
            borderColor: colors.series[0],
            backgroundColor: `${colors.series[0]}26`,
            borderWidth: 2,
            fill: true,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: colors.series[0],
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
  }, [trends.signupsByMonth]);

  const doughnutConfig: ChartConfiguration | null = useMemo(() => {
    if (typeof window === "undefined") return null;
    const colors = getChartColors();
    return {
      type: "doughnut",
      data: {
        labels: [t("roleStudents"), t("roleTeachers"), t("roleAdmins")],
        datasets: [
          {
            data: [trends.roleBreakdown.students, trends.roleBreakdown.teachers, trends.roleBreakdown.admins],
            backgroundColor: colors.series,
            borderWidth: 0,
            hoverOffset: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "65%",
        plugins: {
          legend: { position: "bottom", labels: { color: colors.text, usePointStyle: true, padding: 14 } },
        },
      },
    };
  }, [trends.roleBreakdown, t]);

  return (
    <>
      <DashboardHeader title={tShared("welcome", { name: profile?.name ?? "" })} />

      {overview.loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          <StatCard icon={Users} label={t("statsUsers")} value={overview.userCount} tone="primary" />
          <StatCard icon={GraduationCap} label={t("statsTeachers")} value={overview.teacherCount} tone="accent" />
          <StatCard icon={UserCheck} label={t("statsStudents")} value={overview.studentCount} tone="accent" />
          <Link href="/dashboard/admin/users">
            <StatCard icon={Clock} label={t("statsPendingTeachers")} value={overview.pendingTeacherCount} tone="gold" />
          </Link>
          <StatCard icon={BookOpen} label={t("statsCourses")} value={overview.courseCount} tone="primary" />
          <StatCard icon={CheckCircle2} label={t("statsPublished")} value={overview.publishedCourseCount} tone="success" />
          <StatCard icon={Award} label={t("statsCertificates")} value={overview.certificateCount} tone="gold" />
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-bold">{t("newSignupsChart")}</h3>
          <div className="h-72">{lineConfig && <AdminChart key={theme} config={lineConfig} />}</div>
        </div>
        <div className="rounded-2xl border border-border bg-surface p-5">
          <h3 className="mb-4 text-sm font-bold">{t("usersByRoleChart")}</h3>
          <div className="h-72">{doughnutConfig && <AdminChart key={theme} config={doughnutConfig} />}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold">{t("recentUsers")}</h3>
            <Link href="/dashboard/admin/users" className="text-xs text-primary-strong">
              {t("viewAll")}
            </Link>
          </div>
          {recentUsers.map((u) => (
            <AdminRecentUserRow key={u.uid} user={u} />
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-bold">{t("recentActivity")}</h3>
            <Link href="/dashboard/admin/audit-log" className="text-xs text-primary-strong">
              {t("viewAll")}
            </Link>
          </div>
          {recentActivity.length === 0 ? (
            <p className="py-4 text-sm text-dim">{tAuditLog("noEntries")}</p>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((entry) => (
                <AdminAuditLogRow key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
