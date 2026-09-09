import { CourseCard } from "./CourseCard";
import type { Course } from "@/types/course";

export function CourseGrid({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return <p className="py-16 text-center text-[#8A93A6]">لا توجد دورات في هذه المرحلة بعد.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <CourseCard key={c.id} course={c} />
      ))}
    </div>
  );
}
