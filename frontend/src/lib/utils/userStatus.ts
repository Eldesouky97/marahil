import type { AppUser } from "@/types/user";

/** Missing `status` (accounts created before this field existed) counts as approved. */
export function isPendingTeacher(profile: AppUser | null | undefined): boolean {
  return !!profile && profile.role === "teacher" && !!profile.status && profile.status !== "approved";
}

/** True once an admin has flipped the kill switch — any role, see setUserDisabled(). */
export function isAccountDisabled(profile: AppUser | null | undefined): boolean {
  return !!profile && profile.disabled === true;
}
