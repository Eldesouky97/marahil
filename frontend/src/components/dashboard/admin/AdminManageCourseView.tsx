"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useCourseDetail } from "@/lib/hooks/useCourseDetail";
import { deleteCourse, deleteLesson } from "@/lib/firebase/courses";
import { logAdminAction } from "@/lib/firebase/auditLog";
import { AdminCourseEditForm } from "./AdminCourseEditForm";
import { AdminLessonRow } from "./AdminLessonRow";
import { AdminLessonEditForm } from "./AdminLessonEditForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function AdminManageCourseView({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { profile } = useAuth();
  const { course, lessons, loading, refresh } = useCourseDetail(courseId);
  const t = useTranslations("dashboardAdmin.manageCourse");

  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  if (!course || !profile) {
    return <p className="py-24 text-center text-dim">{t("notFound")}</p>;
  }

  async function handleDeleteCourse() {
    if (!course || !profile) return;
    setDeleting(true);
    await deleteCourse(course.id);
    await logAdminAction(profile, "courseDelete", "course", course.id, course.title);
    router.push("/dashboard/admin/courses");
  }

  async function handleDeleteLesson(lessonId: string, title: string) {
    if (!course || !profile) return;
    await deleteLesson(course.id, lessonId);
    await logAdminAction(profile, "lessonDelete", "lesson", lessonId, title);
    await refresh();
  }

  return (
    <>
      <DashboardHeader
          title={course.title}
          action={
            confirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-dim">{t("deleteConfirm")}</span>
                <Button variant="outline" onClick={() => setConfirmingDelete(false)} className="px-4 py-2 text-sm">
                  {t("cancel")}
                </Button>
                <Button onClick={handleDeleteCourse} disabled={deleting} className="px-4 py-2 text-sm">
                  {t("delete")}
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={() => setConfirmingDelete(true)} className="px-5 py-2.5 text-sm">
                {t("delete")}
              </Button>
            )
          }
        />

        <h2 className="mb-4 text-lg font-bold">{t("editTitle")}</h2>
        <div className="mb-8">
          <AdminCourseEditForm
            course={course}
            onSaved={() => {
              refresh();
              logAdminAction(profile, "courseUpdate", "course", course.id, course.title);
            }}
          />
        </div>

        <h2 className="mb-4 text-lg font-bold">{t("lessons")}</h2>
        <div className="space-y-3">
          {lessons.map((lesson, i) =>
            editingLessonId === lesson.id ? (
              <AdminLessonEditForm
                key={lesson.id}
                courseId={course.id}
                lesson={lesson}
                onSaved={() => {
                  setEditingLessonId(null);
                  refresh();
                  logAdminAction(profile, "lessonUpdate", "lesson", lesson.id, lesson.title);
                }}
                onCancel={() => setEditingLessonId(null)}
              />
            ) : (
              <AdminLessonRow
                key={lesson.id}
                lesson={lesson}
                index={i}
                onEdit={() => setEditingLessonId(lesson.id)}
                onDelete={() => handleDeleteLesson(lesson.id, lesson.title)}
              />
            )
          )}
        </div>
    </>
  );
}
