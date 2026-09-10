import type { StageId } from "./stage";

export type UserRole = "teacher" | "student" | "admin";
export type UserStatus = "pending" | "approved";

export interface PersonalDetails {
  phone?: string;
  age?: number;
  governorate?: string;
  stage?: StageId; // student
  school?: string; // student — school/college name
  subject?: string; // teacher — specialization
  workplace?: string; // teacher
  jobTitle?: string; // teacher
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
}
