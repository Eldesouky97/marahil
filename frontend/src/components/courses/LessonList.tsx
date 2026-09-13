import { Link } from "@/i18n/navigation";
import { CheckCircle2, Lock, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { getLessonAccessState } from "@/lib/utils/lessonAccess";
import type { Lesson } from "@/types/course";

export function LessonList({
  courseId,
  lessons,
  completedLessonIds,
  canAccess,
  isTeacherPreview = false,
}: {
  courseId: string;
  lessons: Lesson[];
  completedLessonIds: string[];
  canAccess: boolean;
  isTeacherPreview?: boolean;
}) {
  const accessMap = getLessonAccessState(lessons, completedLessonIds);

  return (
    <ul className="space-y-2">
      {lessons.map((lesson, i) => {
        const state = accessMap.get(lesson.id) ?? "locked";
        const locked = !isTeacherPreview && state === "locked";
        const canLink = canAccess && !locked;

        const content = (
          <div
            className={cn(
              "flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors",
              canLink && "hover:border-primary/30",
              locked && "opacity-50"
            )}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {state === "done" ? (
                <CheckCircle2 size={17} />
              ) : canLink ? (
                <PlayCircle size={17} />
              ) : (
                <Lock size={15} />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {i + 1}. {lesson.title}
              </p>
            </div>
          </div>
        );

        return (
          <li key={lesson.id}>
            {canLink ? <Link href={`/learn/${courseId}/${lesson.id}`}>{content}</Link> : content}
          </li>
        );
      })}
    </ul>
  );
}
