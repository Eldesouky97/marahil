import type { LessonSlide } from "@/types/lessonSlide";
import type { PptxSection } from "./parsePptx";

export interface LessonGroup {
  title: string;
  slides: LessonSlide[];
}

/**
 * Sorted slide indexes where a new lesson starts (always includes 0). Seeded
 * from real PowerPoint Sections when the file has them; otherwise everything
 * is one lesson — the review screen lets the teacher add more boundaries by
 * hand, using this exact same shape.
 */
export function computeInitialBoundaries(slideCount: number, sections: PptxSection[] | null): number[] {
  if (!sections || sections.length === 0 || slideCount === 0) return [0];
  const boundaries = new Set<number>([0]);
  for (const section of sections) {
    if (section.slideIndexes.length > 0) boundaries.add(Math.min(...section.slideIndexes));
  }
  return [...boundaries].sort((a, b) => a - b);
}

function sectionNameForIndex(index: number, sections: PptxSection[] | null): string | undefined {
  return sections?.find((s) => s.slideIndexes.includes(index))?.name;
}

/** Slices `slides` at `boundaries` into ordered lesson groups. Title per group: the matching PowerPoint section name when sections drove the split, else the group's first slide's own title, else `fallbackTitle`. */
export function groupIntoLessons(
  slides: LessonSlide[],
  boundaries: number[],
  sections: PptxSection[] | null,
  fallbackTitle: string
): LessonGroup[] {
  const sorted = [...new Set(boundaries)].sort((a, b) => a - b);
  if (sorted[0] !== 0) sorted.unshift(0);

  return sorted
    .map((start, i) => {
      const end = i + 1 < sorted.length ? sorted[i + 1] : slides.length;
      const groupSlides = slides.slice(start, end);
      const title = sectionNameForIndex(start, sections) || groupSlides[0]?.title || fallbackTitle;
      return { title, slides: groupSlides };
    })
    .filter((group) => group.slides.length > 0);
}
