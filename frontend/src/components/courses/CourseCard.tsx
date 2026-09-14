"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useStageLabel } from "@/lib/hooks/useStages";
import type { Course } from "@/types/course";

export function CourseCard({ course }: { course: Course }) {
  const stageLabel = useStageLabel();
  const t = useTranslations("courses");
  return (
    <Link href={`/courses/${course.id}`}>
      <Card className="group h-full p-6">
        {course.coverImageUrl ? (
          <div className="mb-5 h-32 w-full overflow-hidden rounded-xl bg-surface-2">
            <Image
              src={course.coverImageUrl}
              alt=""
              width={400}
              height={128}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-primary/[0.12] group-hover:text-primary-strong">
            <BookOpen size={20} />
          </div>
        )}
        <span className="mb-2 inline-block rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary-strong">
          {stageLabel(course.stage)}
        </span>
        <h3 className="mb-2 font-bold">{course.title}</h3>
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-dim">{course.description}</p>
        <div className="mb-2 flex items-center justify-between text-xs text-faint">
          <span>{course.teacherName}</span>
          <span className="flex items-center gap-1">
            <Users size={13} /> {course.studentsCount}
          </span>
        </div>
        <div className="text-sm font-bold text-primary-strong">
          {course.price ? t("priceValue", { price: course.price }) : t("priceFree")}
        </div>
      </Card>
    </Link>
  );
}
