import type { QuizQuestion } from "./quiz";

export type LessonSlideType = "text" | "video" | "quiz" | "code" | "hotspot" | "matching";

interface BaseSlide {
  id: string;
  title?: string;
}

export interface TextSlide extends BaseSlide {
  type: "text";
  body: string;
  imageUrl?: string;
}

export interface VideoCheckpoint {
  id: string;
  timeSeconds: number;
  question: QuizQuestion;
}

export interface VideoSlide extends BaseSlide {
  type: "video";
  source: "youtube" | "upload";
  videoUrl: string;
  /** Only actionable when source === "upload" — pausing/monitoring a YouTube iframe reliably needs the external youtube-iframe-api script. */
  checkpoints?: VideoCheckpoint[];
}

export interface QuizSlide extends BaseSlide {
  type: "quiz";
  questions: QuizQuestion[];
}

export type CodeSlideLanguage = "javascript" | "python" | "html" | "css" | "json" | "bash" | "plain";

export interface CodeSlide extends BaseSlide {
  type: "code";
  language: CodeSlideLanguage;
  code: string;
  caption?: string;
}

export interface HotspotPoint {
  id: string;
  /** 0-100, position on the image */
  xPct: number;
  yPct: number;
  label: string;
  description?: string;
}

export interface HotspotSlide extends BaseSlide {
  type: "hotspot";
  imageUrl: string;
  points: HotspotPoint[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingSlide extends BaseSlide {
  type: "matching";
  pairs: MatchingPair[];
}

export type LessonSlide = TextSlide | VideoSlide | QuizSlide | CodeSlide | HotspotSlide | MatchingSlide;
