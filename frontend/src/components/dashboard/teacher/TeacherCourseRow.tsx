"use client";

import Link from "next/link";
import { useState } from "react";
import { Users } from "lucide-react";
import { setCoursePublished } from "@/lib/firebase/courses";
import { stageLabel } from "@/data/stages";
import { cn } from "@/lib/utils/cn";
import type { Course } from "@/types/course";

export function TeacherCourseRow({ course }: { course: Course }) {
  const [published, setPublished] = useState(course.published);
  const [saving, setSaving] = useState(false);

  async function togglePublish() {
    setSaving(true);
    const next = !published;
    await setCoursePublished(course.id, next);
    setPublished(next);
    setSaving(false);
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-[#141F38] p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href={`/dashboard/teacher/courses/${course.id}`} className="font-medium hover:text-[#E8C878]">
          {course.title}
        </Link>
        <div className="mt-1 flex items-center gap-3 text-xs text-[#8A93A6]">
          <span>{stageLabel(course.stage)}</span>
          <span className="flex items-center gap-1">
            <Users size={12} /> {course.studentsCount}
          </span>
          <span>{course.lessonsCount} درس</span>
        </div>
      </div>

      <button
        onClick={togglePublish}
        disabled={saving}
        className={cn(
          "cursor-pointer self-start rounded-full border px-4 py-1.5 text-xs transition-colors sm:self-auto",
          published
            ? "border-[#3FBFAE]/40 bg-[#3FBFAE]/10 text-[#3FBFAE]"
            : "border-white/15 text-[#8A93A6]"
        )}
      >
        {published ? "منشورة" : "مسودة — انشرها"}
      </button>
    </div>
  );
}
