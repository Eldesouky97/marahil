import Link from "next/link";
import { stageLabel } from "@/data/stages";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { EnrolledCourse } from "@/lib/hooks/useStudentDashboard";

export function EnrolledCourseRow({ item }: { item: EnrolledCourse }) {
  return (
    <Link
      href={`/courses/${item.course.id}`}
      className="block rounded-xl border border-white/[0.06] bg-[#141F38] p-4 transition-colors hover:border-[#D4A94F]/30"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{item.course.title}</span>
        <span className="text-xs text-[#8A93A6]">{stageLabel(item.course.stage)}</span>
      </div>
      <ProgressBar value={item.enrollment.progress} />
      <div className="mt-2 text-xs text-[#8A93A6]">{item.enrollment.progress}% مكتمل</div>
    </Link>
  );
}
