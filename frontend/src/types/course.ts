import type { StageId } from "./stage";
import type { QuizQuestion } from "./quiz";

export interface Lesson {
  id: string;
  title: string;
  order: number;
  videoUrl?: string;
  content?: string;
  imageUrl?: string;
  quiz?: QuizQuestion[];
}

export interface CourseMaterial {
  name: string;
  url: string;
  sizeBytes: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  stage: StageId;
  subject: string;
  teacherId: string;
  teacherName: string;
  coverIcon: string;
  coverImageUrl?: string;
  published: boolean;
  lessonsCount: number;
  studentsCount: number;
  createdAt: number;
  /** EGP. Undefined/0 = free. Display-only for now — no payment gateway, enrollment stays free/immediate regardless. */
  price?: number;
  /** Downloadable course-level materials (PDFs, docs, etc.) — separate from per-lesson content. */
  materials?: CourseMaterial[];
  /** A short self-assessment quiz for the whole course, independent of any lesson's own quiz/progress/certificate. */
  quiz?: QuizQuestion[];
}

export interface Enrollment {
  id: string;
  uid: string;
  courseId: string;
  completedLessonIds: string[];
  quizScores: Record<string, number>;
  progress: number;
  certificateIssued: boolean;
  enrolledAt: number;
  updatedAt: number;
}
