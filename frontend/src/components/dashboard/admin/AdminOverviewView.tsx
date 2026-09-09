"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award, BookOpen, CheckCircle2, GraduationCap, UserCheck, Users } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useAdminOverview } from "@/lib/hooks/useAdminOverview";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function AdminOverviewView() {
  const { profile } = useAuth();
  const overview = useAdminOverview();
  const t = useTranslations("dashboardAdmin.overview");
  const tShared = useTranslations("dashboardShared");

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader title={tShared("welcome", { name: profile?.name ?? "" })} />

        {overview.loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard icon={Users} label={t("statsUsers")} value={overview.userCount} />
            <StatCard icon={GraduationCap} label={t("statsTeachers")} value={overview.teacherCount} />
            <StatCard icon={UserCheck} label={t("statsStudents")} value={overview.studentCount} />
            <StatCard icon={BookOpen} label={t("statsCourses")} value={overview.courseCount} />
            <StatCard icon={CheckCircle2} label={t("statsPublished")} value={overview.publishedCourseCount} />
            <StatCard icon={Award} label={t("statsCertificates")} value={overview.certificateCount} />
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/dashboard/admin/users">
            <Button variant="outline" className="px-5 py-2.5 text-sm">
              {t("manageUsers")}
            </Button>
          </Link>
          <Link href="/dashboard/admin/courses">
            <Button variant="outline" className="px-5 py-2.5 text-sm">
              {t("manageCourses")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
