import Link from "next/link";
import { BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { stageLabel } from "@/data/stages";
import type { Course } from "@/types/course";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="group h-full p-6">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#3FBFAE]/10 text-[#3FBFAE] transition-colors group-hover:bg-[#D4A94F]/[0.12] group-hover:text-[#E8C878]">
          <BookOpen size={20} />
        </div>
        <span className="mb-2 inline-block rounded-full border border-[#D4A94F]/30 bg-[#D4A94F]/10 px-3 py-1 text-xs text-[#E8C878]">
          {stageLabel(course.stage)}
        </span>
        <h3 className="mb-2 font-bold">{course.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#8A93A6]">{course.description}</p>
        <div className="flex items-center justify-between text-xs text-[#5C6584]">
          <span>{course.teacherName}</span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {course.studentsCount}
          </span>
        </div>
      </Card>
    </Link>
  );
}
