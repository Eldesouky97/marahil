"use client";

import Link from "next/link";
import { Award, BookOpen, Search } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useStudentDashboard } from "@/lib/hooks/useStudentDashboard";
import { EnrolledCourseRow } from "./EnrolledCourseRow";
import { CertificateRow } from "./CertificateRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function StudentDashboardView() {
  const { profile } = useAuth();
  const { enrolledCourses, certificates, loading } = useStudentDashboard(profile?.uid);

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader
          title={`أهلًا، ${profile?.name ?? ""}`}
          action={
            <Link href="/courses">
              <Button variant="outline" className="px-5 py-2.5 text-sm">
                <Search size={16} /> تصفّح الدورات
              </Button>
            </Link>
          }
        />

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={BookOpen} label="دوراتي" value={enrolledCourses.length} />
          <StatCard icon={Award} label="شهاداتي" value={certificates.length} />
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <h2 className="mb-4 text-lg font-bold">دوراتي</h2>
              {enrolledCourses.length === 0 ? (
                <p className="text-[#8A93A6]">لم تلتحق بأي دورة بعد.</p>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map((item) => (
                    <EnrolledCourseRow key={item.enrollment.id} item={item} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h2 className="mb-4 text-lg font-bold">شهاداتي</h2>
              {certificates.length === 0 ? (
                <p className="text-[#8A93A6]">أكمل دورة لتحصل على أول شهادة.</p>
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
      </Container>
    </section>
  );
}
