"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { StageFilter } from "@/components/courses/StageFilter";
import { CourseGrid } from "@/components/courses/CourseGrid";
import { Spinner } from "@/components/ui/Spinner";
import { Container } from "@/components/ui/Container";
import { inputClasses } from "@/components/ui/FormField";
import { usePublishedCourses } from "@/lib/hooks/usePublishedCourses";
import { listCourseReviews } from "@/lib/firebase/reviews";
import type { StageId } from "@/types/stage";

type SortKey = "newest" | "popular" | "priceAsc" | "rating";

export default function CoursesPage() {
  const [stage, setStage] = useState<StageId | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const { courses, loading } = usePublishedCourses(stage);
  const t = useTranslations("courses");

  useEffect(() => {
    if (sort !== "rating" || courses.length === 0) return;
    let cancelled = false;
    Promise.all(
      courses.map(async (c) => {
        const reviews = await listCourseReviews(c.id);
        const avg = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
        return [c.id, avg] as const;
      })
    ).then((pairs) => {
      if (!cancelled) setRatings(Object.fromEntries(pairs));
    });
    return () => {
      cancelled = true;
    };
  }, [sort, courses]);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? courses.filter((c) => c.title.toLowerCase().includes(q) || c.teacherName.toLowerCase().includes(q))
      : courses;

    const sorted = [...filtered];
    switch (sort) {
      case "popular":
        sorted.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case "priceAsc":
        sorted.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
        break;
      case "rating":
        sorted.sort((a, b) => (ratings[b.id] ?? 0) - (ratings[a.id] ?? 0));
        break;
      default:
        sorted.sort((a, b) => b.createdAt - a.createdAt);
    }
    return sorted;
  }, [courses, search, sort, ratings]);

  return (
    <section className="py-16">
      <Container>
        <h1 className="mb-8 text-center font-display text-3xl text-heading">{t("catalogTitle")}</h1>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-faint ltr:left-3 rtl:right-3" />
            <input
              className={`${inputClasses} ltr:pl-9 rtl:pr-9`}
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={`${inputClasses} sm:w-56`} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="newest">{t("sortNewest")}</option>
            <option value="popular">{t("sortPopular")}</option>
            <option value="priceAsc">{t("sortPriceAsc")}</option>
            <option value="rating">{t("sortRating")}</option>
          </select>
        </div>

        <div className="mb-10">
          <StageFilter value={stage} onChange={setStage} />
        </div>
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        ) : (
          <CourseGrid courses={filteredSorted} />
        )}
      </Container>
    </section>
  );
}
