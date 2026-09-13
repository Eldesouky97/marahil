import { Award, BookOpen, CheckCircle2, Flame, PlayCircle, Star, type LucideIcon } from "lucide-react";
import type { EnrolledCourse } from "./useStudentDashboard";
import type { AppUser } from "@/types/user";
import type { Certificate } from "@/types/certificate";

export interface BadgeContext {
  profile: AppUser | null;
  enrolledCourses: EnrolledCourse[];
  certificates: Certificate[];
}

export interface BadgeDef {
  id: string;
  icon: LucideIcon;
  condition: (ctx: BadgeContext) => boolean;
}

export const BADGES: BadgeDef[] = [
  {
    id: "firstLesson",
    icon: PlayCircle,
    condition: (c) => c.enrolledCourses.some((e) => e.enrollment.completedLessonIds.length > 0),
  },
  {
    id: "firstCertificate",
    icon: Award,
    condition: (c) => c.certificates.length > 0,
  },
  {
    id: "threeCourses",
    icon: BookOpen,
    condition: (c) => c.enrolledCourses.length >= 3,
  },
  {
    id: "perfectQuiz",
    icon: Star,
    condition: (c) => c.enrolledCourses.some((e) => Object.values(e.enrollment.quizScores).some((s) => s === 100)),
  },
  {
    id: "weekStreak",
    icon: Flame,
    condition: (c) => (c.profile?.streakCount ?? 0) >= 7,
  },
  {
    id: "courseComplete",
    icon: CheckCircle2,
    condition: (c) => c.enrolledCourses.some((e) => e.enrollment.progress === 100),
  },
];

export function useBadges(ctx: BadgeContext) {
  return BADGES.map((b) => ({ ...b, earned: b.condition(ctx) }));
}
