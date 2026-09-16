import { AlignLeft, ClipboardCheck, Code2, MousePointerClick, Shuffle, Video } from "lucide-react";
import type { LessonSlideType } from "@/types/lessonSlide";

export const SLIDE_TYPES: LessonSlideType[] = ["text", "video", "quiz", "code", "hotspot", "matching"];

export const SLIDE_ICONS: Record<LessonSlideType, typeof AlignLeft> = {
  text: AlignLeft,
  video: Video,
  quiz: ClipboardCheck,
  code: Code2,
  hotspot: MousePointerClick,
  matching: Shuffle,
};
