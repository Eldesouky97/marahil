import type { StageId } from "./stage";

export type UserRole = "teacher" | "student" | "admin";
export type UserStatus = "pending" | "approved";

export interface PersonalDetails {
  phone?: string;
  /** Manually entered for students (no national ID on file); derived from `nationalId` for teacher/admin — see lib/utils/nationalId.ts. */
  age?: number;
  governorate?: string; // a GovernorateId (see types/governorate.ts) for anything entered through the dropdown; older free-text values may still exist
  stage?: StageId; // student
  school?: string; // student — school/college name
  subject?: string; // teacher — specialization
  workplace?: string; // teacher
  jobTitle?: string; // teacher
  nationalId?: string; // teacher/admin — 14-digit Egyptian national ID, also the source of `age`
}

export interface AppUser extends PersonalDetails {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  /** Admin-set kill switch, independent of `status` — see backend/firestore.rules isApproved(). */
  disabled?: boolean;
  photoURL?: string;
  createdAt: number;
  /** Self-awarded on lesson completion — see lib/firebase/users.ts awardLessonCompletionRewards() and its matching rate-limit in backend/firestore.rules. */
  xp?: number;
  streakCount?: number;
  /** "YYYY-MM-DD", UTC — last day XP/streak were bumped, used to allow at most one bump per day. */
  lastActiveDate?: string;
}
