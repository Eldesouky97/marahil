"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Copy, Eye, Plus } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useToast } from "@/components/ui/ToastProvider";
import { setCoursePublished, duplicateCourse, deleteCourse } from "@/lib/firebase/courses";
import { useCourseDetail } from "@/lib/hooks/useCourseDetail";
import { TeacherLessonList } from "./TeacherLessonList";
import { LessonForm } from "./LessonForm";
import { CourseSettingsPanel } from "./CourseSettingsPanel";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";

export function ManageCourseView({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { profile } = useAuth();
  const { showToast } = useToast();
  const { course, lessons, loading, refresh } = useCourseDetail(courseId);
  const [publishing, setPublishing] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [manualShowAddLesson, setManualShowAddLesson] = useState<boolean | null>(null);
  const t = useTranslations("dashboardTeacher.manageCourse");

  // Default the "add lesson" form open only for a genuinely empty course —
  // once at least one lesson already exists (e.g. a course just created
  // from a PPTX import), landing here shouldn't greet the teacher with an
  // empty form that reads as "start over"; they open it on purpose instead.
  // Purely derived (no effect/ref) — a manual toggle overrides it for the
  // rest of this mount; with no override, it just tracks lessons.length, so
  // deleting the last remaining lesson naturally reopens it too.
  const showAddLesson = manualShowAddLesson ?? lessons.length === 0;

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

  async function togglePublish() {
    if (!course) return;
    setPublishing(true);
    await setCoursePublished(course.id, !course.published);
    await refresh();
    setPublishing(false);
  }

  async function handleDuplicate() {
    if (!course || !profile) return;
    setDuplicating(true);
    try {
      const newCourseId = await duplicateCourse(course.id, profile.uid, profile.name, t("duplicateSuffix"));
      router.push(`/dashboard/teacher/courses/${newCourseId}`);
    } catch (err) {
      console.error("duplicateCourse failed:", err);
      showToast(t("duplicateFailed"), { tone: "error" });
      setDuplicating(false);
    }
  }

  async function handleDelete() {
    if (!course) return;
    setDeleting(true);
    try {
      await deleteCourse(course.id);
      router.push("/dashboard/teacher");
    } catch (err) {
      console.error("deleteCourse failed:", err);
      showToast(t("deleteFailed"), { tone: "error" });
      setDeleting(false);
    }
  }

  return (
    <>
      <DashboardHeader
        title={course.title}
        action={
          <div className="flex flex-wrap gap-2">
            <Link href={`/courses/${course.id}`}>
              <Button variant="outline" className="px-5 py-2.5 text-sm">
                <Eye size={16} /> {t("previewAsStudent")}
              </Button>
            </Link>
            <Button variant="outline" onClick={handleDuplicate} disabled={duplicating} className="px-5 py-2.5 text-sm">
              <Copy size={16} /> {duplicating ? t("duplicating") : t("duplicateCourse")}
            </Button>
            <Button
              variant={course.published ? "outline" : "primary"}
              onClick={togglePublish}
              disabled={publishing}
              className="px-5 py-2.5 text-sm"
            >
              {course.published ? t("unpublish") : t("publish")}
            </Button>
          </div>
        }
      />

      <h2 className="mb-4 text-lg font-bold">{t("lessons")}</h2>
      <div className="mb-8">
        <TeacherLessonList courseId={course.id} lessons={lessons} onChanged={refresh} />
      </div>

      {showAddLesson ? (
        <>
          <h2 className="mb-4 text-lg font-bold">{t("addLesson")}</h2>
          <LessonForm
            courseId={course.id}
            nextOrder={lessons.length}
            onSaved={() => {
              setManualShowAddLesson(false);
              refresh();
            }}
            onCancel={() => setManualShowAddLesson(false)}
          />
        </>
      ) : (
        <Button variant="outline" onClick={() => setManualShowAddLesson(true)} className="px-5 py-2.5 text-sm">
          <Plus size={16} /> {t("addLesson")}
        </Button>
      )}

      <h2 className="mb-4 mt-10 text-lg font-bold">{t("moreSettings")}</h2>
      <CourseSettingsPanel course={course} onSaved={refresh} />

      <h2 className="mb-4 mt-10 text-lg font-bold text-danger">{t("dangerZone")}</h2>
      <div className="rounded-xl border border-danger/30 bg-danger/4 p-5">
        {course.studentsCount > 0 ? (
          <p className="text-sm text-dim">{t("deleteBlockedStudents", { count: course.studentsCount })}</p>
        ) : confirmingDelete ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-dim">{t("deleteConfirm")}</span>
            <Button variant="outline" onClick={() => setConfirmingDelete(false)} className="px-4 py-2 text-sm">
              {t("cancel")}
            </Button>
            <Button onClick={handleDelete} disabled={deleting} className="bg-danger px-4 py-2 text-sm text-primary-ink">
              {deleting ? t("deleting") : t("deleteCourseConfirmButton")}
            </Button>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setConfirmingDelete(true)} className="px-5 py-2.5 text-sm text-danger">
            {t("deleteCourse")}
          </Button>
        )}
      </div>
    </>
  );
}
