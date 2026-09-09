"use client";

import { useState } from "react";
import { setCoursePublished } from "@/lib/firebase/courses";
import { useCourseDetail } from "@/lib/hooks/useCourseDetail";
import { TeacherLessonList } from "./TeacherLessonList";
import { LessonForm } from "./LessonForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";

export function ManageCourseView({ courseId }: { courseId: string }) {
  const { course, lessons, loading, refresh } = useCourseDetail(courseId);
  const [publishing, setPublishing] = useState(false);

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

  async function togglePublish() {
    if (!course) return;
    setPublishing(true);
    await setCoursePublished(course.id, !course.published);
    await refresh();
    setPublishing(false);
  }

  return (
    <section className="py-12">
      <Container>
        <DashboardHeader
          title={course.title}
          action={
            <Button variant={course.published ? "outline" : "gold"} onClick={togglePublish} disabled={publishing} className="px-5 py-2.5 text-sm">
              {course.published ? "إلغاء النشر" : "نشر الدورة"}
            </Button>
          }
        />

        <h2 className="mb-4 text-lg font-bold">الدروس</h2>
        <div className="mb-8">
          <TeacherLessonList lessons={lessons} />
        </div>

        <h2 className="mb-4 text-lg font-bold">إضافة درس جديد</h2>
        <LessonForm courseId={course.id} nextOrder={lessons.length} onCreated={refresh} />
      </Container>
    </section>
  );
}
