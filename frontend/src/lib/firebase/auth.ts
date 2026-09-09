import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "./client";
import { createUserProfile } from "./users";
import type { UserRole } from "@/types/user";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await createUserProfile(credential.user.uid, { name, email, role });
  return credential.user;
}

export async function loginUser(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return credential.user;
}

/**
 * Signs in (or silently registers, on first use) via Google. Returns the raw
 * Firebase Auth user — it may not have a `users/{uid}` Firestore doc yet
 * (Google gives no role), so callers must check getUserProfile() and route
 * first-time sign-ins to /auth/complete-profile.
 */
export async function signInWithGoogle() {
  const credential = await signInWithPopup(auth, new GoogleAuthProvider());
  return credential.user;
}

export function resetPassword(email: string) {
  return sendPasswordResetEmail(auth, email);
}

export function logoutUser() {
  return firebaseSignOut(auth);
}
