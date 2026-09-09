"use client";

import Link from "next/link";
import { Award, BookOpen, Plus, Users } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import { useTeacherCourses } from "@/lib/hooks/useTeacherCourses";
import { TeacherCourseRow } from "./TeacherCourseRow";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function TeacherDashboardView() {
  const { profile } = useAuth();
  const { courses, loading } = useTeacherCourses(profile?.uid);

  const totalStudents = courses.reduce((sum, c) => sum + c.studentsCount, 0);
  const publishedCount = courses.filter((c) => c.published).length;

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader
          title={`أهلًا، ${profile?.name ?? ""}`}
          action={
            <Link href="/dashboard/teacher/courses/new">
              <Button className="px-5 py-2.5 text-sm">
                <Plus size={16} /> دورة جديدة
              </Button>
            </Link>
          }
        />

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard icon={BookOpen} label="دوراتي" value={courses.length} />
          <StatCard icon={Award} label="منشورة" value={publishedCount} />
          <StatCard icon={Users} label="إجمالي الطلاب" value={totalStudents} />
        </div>

        <h2 className="mb-4 text-lg font-bold">دوراتي</h2>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : courses.length === 0 ? (
          <p className="text-[#8A93A6]">لم تنشئ أي دورة بعد.</p>
        ) : (
          <div className="space-y-3">
            {courses.map((c) => (
              <TeacherCourseRow key={c.id} course={c} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
