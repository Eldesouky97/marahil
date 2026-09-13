"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Award, BookOpen, Search } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useStudentDashboard } from "@/lib/hooks/useStudentDashboard";
import { useContinueLearning } from "@/lib/hooks/useContinueLearning";
import { EnrolledCourseRow } from "./EnrolledCourseRow";
import { CertificateRow } from "./CertificateRow";
import { ContinueLearningCard } from "./ContinueLearningCard";
import { BadgesRow } from "./BadgesRow";
import { XpStreakBar } from "./XpStreakBar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function StudentDashboardView() {
  const { profile } = useAuth();
  const { enrolledCourses, certificates, loading } = useStudentDashboard(profile?.uid);
  const continueData = useContinueLearning(enrolledCourses);
  const t = useTranslations("dashboardStudent");
  const tShared = useTranslations("dashboardShared");

  return (
    <>
      <DashboardHeader
        title={tShared("welcome", { name: profile?.name ?? "" })}
        action={
          <Link href="/courses">
            <Button variant="outline" className="px-5 py-2.5 text-sm">
              <Search size={16} /> {t("browseCourses")}
            </Button>
          </Link>
        }
      />

      <XpStreakBar profile={profile} />

      {continueData && <ContinueLearningCard data={continueData} />}

      <BadgesRow profile={profile} enrolledCourses={enrolledCourses} certificates={certificates} />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard icon={BookOpen} label={t("statsCourses")} value={enrolledCourses.length} />
        <StatCard icon={Award} label={t("statsCertificates")} value={certificates.length} />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-bold">{t("myCourses")}</h2>
            {enrolledCourses.length === 0 ? (
              <p className="text-dim">{t("noCourses")}</p>
            ) : (
              <div className="space-y-3">
                {enrolledCourses.map((item) => (
                  <EnrolledCourseRow key={item.enrollment.id} item={item} />
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-lg font-bold">{t("myCertificates")}</h2>
            {certificates.length === 0 ? (
              <p className="text-dim">{t("noCertificates")}</p>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <CertificateRow key={cert.id} certificate={cert} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
