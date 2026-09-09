import type { AppUser } from "@/types/user";

/** Missing `status` (accounts created before this field existed) counts as approved. */
export function isPendingTeacher(profile: AppUser | null | undefined): boolean {
  return !!profile && profile.role === "teacher" && !!profile.status && profile.status !== "approved";
}
