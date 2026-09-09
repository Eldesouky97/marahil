export type UserRole = "teacher" | "student" | "admin";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: number;
}
