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
