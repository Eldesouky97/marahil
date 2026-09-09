"use client";

import { stageLabel } from "@/data/stages";
import { useAuth } from "@/context/AuthProvider";
import { useCourseDetail } from "@/lib/hooks/useCourseDetail";
import { useEnrollment } from "@/lib/hooks/useEnrollment";
import { LessonList } from "./LessonList";
import { EnrollPanel } from "./EnrollPanel";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function CourseDetailView({ courseId }: { courseId: string }) {
  const { profile } = useAuth();
  const { course, lessons, loading } = useCourseDetail(courseId);
  const { enrollment } = useEnrollment(profile?.uid, courseId);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return <p className="py-24 text-center text-[#8A93A6]">لم يتم العثور على هذه الدورة.</p>;
  }

  const canAccess = !!enrollment || profile?.uid === course.teacherId;

  return (
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Badge className="mb-4">{stageLabel(course.stage)}</Badge>
          <h1 className="mb-3 font-display text-3xl text-[#F6EFDD]">{course.title}</h1>
          <p className="mb-8 leading-relaxed text-[#8A93A6]">{course.description}</p>

          <h2 className="mb-4 text-lg font-bold">محتوى الدورة</h2>
          <LessonList
            courseId={course.id}
            lessons={lessons}
            completedLessonIds={enrollment?.completedLessonIds ?? []}
            canAccess={canAccess}
          />
        </div>

        <div className="h-fit rounded-2xl border border-white/10 bg-[#0F1729] p-6">
          <p className="mb-1 text-xs text-[#5C6584]">المعلّم</p>
          <p className="mb-6 font-bold">{course.teacherName}</p>
          <EnrollPanel courseId={course.id} />
        </div>
      </Container>
    </section>
  );
}
