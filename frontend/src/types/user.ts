export type UserRole = "teacher" | "student";

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: number;
}
