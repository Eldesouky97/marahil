import type { Lesson } from "@/types/course";

export type LessonAccessState = "done" | "active" | "locked";

/** lessons must already be sorted by .order — listLessons() already does this. */
export function getLessonAccessState(
  lessons: Lesson[],
  completedLessonIds: string[]
): Map<string, LessonAccessState> {
  const map = new Map<string, LessonAccessState>();
  let activeAssigned = false;
  for (const lesson of lessons) {
    if (completedLessonIds.includes(lesson.id)) {
      map.set(lesson.id, "done");
    } else if (!activeAssigned) {
      map.set(lesson.id, "active");
      activeAssigned = true;
    } else {
      map.set(lesson.id, "locked");
    }
  }
  return map;
}

export function isLessonLocked(lessons: Lesson[], completedLessonIds: string[], lessonId: string): boolean {
  return getLessonAccessState(lessons, completedLessonIds).get(lessonId) === "locked";
}
