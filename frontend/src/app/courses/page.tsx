"use client";

import { useState } from "react";
import { StageFilter } from "@/components/courses/StageFilter";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";
import { usePublishedCourses } from "@/lib/hooks/usePublishedCourses";
import type { StageId } from "@/types/stage";

export default function CoursesPage() {
  const [stage, setStage] = useState<StageId | "all">("all");
  const { courses, loading } = usePublishedCourses(stage);

  return (
    <section className="py-16">
      <Container>
        <h1 className="mb-8 text-center font-display text-3xl text-[#F6EFDD]">تصفّح الدورات</h1>
        <div className="mb-10">
          <StageFilter value={stage} onChange={setStage} />
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <CourseGrid courses={courses} />
        )}
      </Container>
    </section>
  );
}
