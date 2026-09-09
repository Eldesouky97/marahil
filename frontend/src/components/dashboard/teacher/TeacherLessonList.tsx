import { ClipboardCheck, PlayCircle } from "lucide-react";
import type { Lesson } from "@/types/course";

export function TeacherLessonList({ lessons }: { lessons: Lesson[] }) {
  if (lessons.length === 0) {
    return <p className="text-sm text-[#8A93A6]">لا توجد دروس بعد — أضف أول درس أدناه.</p>;
  }
  return (
    <ul className="space-y-2">
      {lessons.map((lesson, i) => (
        <li
          key={lesson.id}
          className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-[#141F38] p-4"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3FBFAE]/10 text-[#3FBFAE]">
            <PlayCircle size={17} />
          </span>
          <span className="flex-1 truncate text-sm font-medium">
            {i + 1}. {lesson.title}
          </span>
          {lesson.quiz && lesson.quiz.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-[#D4A94F]">
              <ClipboardCheck size={13} /> {lesson.quiz.length} أسئلة
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
