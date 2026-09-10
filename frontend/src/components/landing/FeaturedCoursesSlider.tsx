"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, Users } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePublishedCourses } from "@/lib/hooks/usePublishedCourses";
import { useStageLabel } from "@/lib/hooks/useStages";
import { cn } from "@/lib/utils/cn";

const AUTO_ADVANCE_MS = 5000;
const MAX_SLIDES = 6;

/**
 * Replaces the old 3D star: real published courses (most-enrolled first),
 * not a decoration. Renders nothing while loading or if there are no
 * published courses yet, rather than showing an empty carousel.
 */
export function FeaturedCoursesSlider() {
  const { courses, loading } = usePublishedCourses("all");
  const stageLabel = useStageLabel();
  const t = useTranslations("hero");
  const [index, setIndex] = useState(0);

  const featured = [...courses].sort((a, b) => b.studentsCount - a.studentsCount).slice(0, MAX_SLIDES);

  useEffect(() => {
    if (featured.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % featured.length), AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [featured.length]);

  if (loading || featured.length === 0) return null;

  const course = featured[index % featured.length];

  function go(delta: number) {
    setIndex((i) => (i + delta + featured.length) % featured.length);
  }

  return (
    <div className="mx-auto mb-8 w-full max-w-lg">
      <p className="mb-3 text-center text-xs font-bold text-accent">{t("featuredCourses")}</p>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
        <AnimatePresence mode="wait">
          <motion.div
            key={course.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Link href={`/courses/${course.id}`} className="flex items-center gap-4 p-4 text-start">
              {course.coverImageUrl ? (
                <Image
                  src={course.coverImageUrl}
                  alt=""
                  width={72}
                  height={72}
                  className="h-16 w-16 shrink-0 rounded-xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <BookOpen size={24} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <span className="mb-1 inline-block rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] text-primary-strong">
                  {stageLabel(course.stage)}
                </span>
                <h3 className="truncate font-bold text-heading">{course.title}</h3>
                <div className="flex items-center gap-3 text-xs text-dim">
                  <span className="truncate">{course.teacherName}</span>
                  <span className="flex shrink-0 items-center gap-1">
                    <Users size={12} />
                    {course.studentsCount}
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {featured.length > 1 && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="previous"
              className="absolute top-1/2 start-2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-body shadow-sm transition-colors hover:text-primary-strong"
            >
              <ChevronRight size={16} className="ltr:rotate-180" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="next"
              className="absolute top-1/2 end-2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-surface/90 text-body shadow-sm transition-colors hover:text-primary-strong"
            >
              <ChevronLeft size={16} className="ltr:rotate-180" />
            </button>
          </>
        )}
      </div>

      {featured.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {featured.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setIndex(i)}
              aria-label={`${i + 1}`}
              className={cn("h-1.5 rounded-full transition-all", i === index ? "w-5 bg-primary" : "w-1.5 bg-border")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
