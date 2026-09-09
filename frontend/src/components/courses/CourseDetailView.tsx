"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { useStageLabel } from "@/lib/hooks/useStages";
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
  const stageLabel = useStageLabel();
  const t = useTranslations("courses");

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!course) {
    return <p className="py-24 text-center text-dim">{t("notFound")}</p>;
  }

  const canAccess = !!enrollment || profile?.uid === course.teacherId;

  return (
    <section className="py-16">
      <Container className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.coverImageUrl && (
            <div className="mb-6 h-56 w-full overflow-hidden rounded-2xl bg-surface-2">
              <Image
                src={course.coverImageUrl}
                alt=""
                width={900}
                height={224}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Badge className="mb-4">{stageLabel(course.stage)}</Badge>
          <h1 className="mb-3 font-display text-3xl text-heading">{course.title}</h1>
          <p className="mb-8 leading-relaxed text-dim">{course.description}</p>

          <h2 className="mb-4 text-lg font-bold">{t("content")}</h2>
          <LessonList
            courseId={course.id}
            lessons={lessons}
            completedLessonIds={enrollment?.completedLessonIds ?? []}
            canAccess={canAccess}
          />
        </div>

        <div className="h-fit rounded-2xl border border-border bg-surface-2 p-6">
          <p className="mb-1 text-xs text-faint">{t("teacher")}</p>
          <p className="mb-6 font-bold">{course.teacherName}</p>
          <EnrollPanel courseId={course.id} />
        </div>
      </Container>
    </section>
  );
}
