"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Radio, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useTeacherCourses } from "@/lib/hooks/useTeacherCourses";
import { useTeacherLiveSessions } from "@/lib/hooks/useTeacherLiveSessions";
import { createLiveSession, deleteLiveSession, endLiveSession, startLiveSession } from "@/lib/firebase/liveSessions";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { FormField, inputClasses } from "@/components/ui/FormField";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";
import type { LiveSessionStatus } from "@/types/liveSession";

const STATUS_TONE: Record<LiveSessionStatus, string> = {
  scheduled: "border-border-strong text-dim",
  live: "border-danger/40 bg-danger/10 text-danger",
  ended: "border-border text-faint",
};

export function TeacherLiveSessionsView() {
  const { profile } = useAuth();
  const { courses } = useTeacherCourses(profile?.uid);
  const { sessions, loading, refresh } = useTeacherLiveSessions(profile?.uid);
  const t = useTranslations("liveSessions");

  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const course = courses.find((c) => c.id === courseId);
    if (!profile || !course || !title.trim() || !scheduledAt) return;
    setSaving(true);
    await createLiveSession({
      courseId: course.id,
      courseTitle: course.title,
      teacherId: profile.uid,
      teacherName: profile.name,
      title,
      scheduledAt: new Date(scheduledAt).getTime(),
    });
    setTitle("");
    setScheduledAt("");
    setSaving(false);
    refresh();
  }

  return (
    <>
      <DashboardHeader title={t("manageTitle")} />

      <form onSubmit={handleCreate} className="mb-8 space-y-4 rounded-xl border border-border bg-surface-2 p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField label={t("courseLabel")}>
            <select className={inputClasses} value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              <option value="">{t("courseSelectPlaceholder")}</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label={t("sessionTitleLabel")}>
            <input className={inputClasses} value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField label={t("scheduledAtLabel")}>
            <input
              type="datetime-local"
              className={inputClasses}
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </FormField>
        </div>
        <Button type="submit" disabled={saving || !courseId || !title.trim() || !scheduledAt} className="px-5 py-2.5 text-sm">
          {saving ? t("scheduling") : t("scheduleSession")}
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : sessions.length === 0 ? (
        <p className="text-dim">{t("noSessions")}</p>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{s.title}</p>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-dim">
                  <span>{s.courseTitle}</span>
                  <span>{new Date(s.scheduledAt).toLocaleString()}</span>
                  <span className={cn("rounded-full border px-2.5 py-0.5", STATUS_TONE[s.status])}>{t(`status.${s.status}`)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.status === "scheduled" && (
                  <Button variant="outline" className="px-4 py-2 text-sm" onClick={() => startLiveSession(s.id).then(refresh)}>
                    <Radio size={14} /> {t("startSession")}
                  </Button>
                )}
                {s.status === "live" && (
                  <Link href={`/live/${s.id}`}>
                    <Button className="px-4 py-2 text-sm">{t("enterRoom")}</Button>
                  </Link>
                )}
                {s.status !== "live" && (
                  <button
                    type="button"
                    onClick={() => deleteLiveSession(s.id).then(refresh)}
                    className="cursor-pointer text-danger"
                    aria-label={t("deleteSession")}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                {s.status === "live" && (
                  <button
                    type="button"
                    onClick={() => endLiveSession(s.id).then(refresh)}
                    className="cursor-pointer text-xs text-dim hover:text-danger"
                  >
                    {t("endSession")}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
