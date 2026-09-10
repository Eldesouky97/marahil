"use client";

import { useTranslations } from "next-intl";
import { useAdminCourses } from "@/lib/hooks/useAdminCourses";
import { AdminCourseRow } from "./AdminCourseRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Spinner } from "@/components/ui/Spinner";

export function AdminCoursesView() {
  const { courses, loading } = useAdminCourses();
  const t = useTranslations("dashboardAdmin.courses");

  return (
    <>
      <DashboardHeader title={t("title")} />

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-dim">{t("noCourses")}</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <AdminCourseRow key={c.id} course={c} />
          ))}
        </div>
      )}
    </>
  );
}
