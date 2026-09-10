"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award, BookOpen, Plus, Users } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useTeacherCourses } from "@/lib/hooks/useTeacherCourses";
import { TeacherCourseRow } from "./TeacherCourseRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function TeacherDashboardView() {
  const { profile } = useAuth();
  const { courses, loading } = useTeacherCourses(profile?.uid);
  const t = useTranslations("dashboardTeacher");
  const tShared = useTranslations("dashboardShared");

  const totalStudents = courses.reduce((sum, c) => sum + c.studentsCount, 0);
  const publishedCount = courses.filter((c) => c.published).length;

  return (
    <>
      <DashboardHeader
        title={tShared("welcome", { name: profile?.name ?? "" })}
        action={
          <Link href="/dashboard/teacher/courses/new">
            <Button className="px-5 py-2.5 text-sm">
              <Plus size={16} /> {t("newCourse")}
            </Button>
          </Link>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={BookOpen} label={t("statsCourses")} value={courses.length} />
        <StatCard icon={Award} label={t("statsPublished")} value={publishedCount} />
        <StatCard icon={Users} label={t("statsStudents")} value={totalStudents} />
      </div>

      <h2 className="mb-4 text-lg font-bold">{t("myCourses")}</h2>
      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-dim">{t("noCourses")}</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c) => (
            <TeacherCourseRow key={c.id} course={c} />
          ))}
        </div>
      )}
    </>
  );
}
