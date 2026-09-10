import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./client";
import { createUserProfile } from "./users";
import type { PersonalDetails, UserRole } from "@/types/user";

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole,
  details: PersonalDetails
) {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: name });
  await createUserProfile(credential.user.uid, { name, email, role, ...details });
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

/**
 * Admin-only (see AdminAddUserForm). Creates the Firebase Auth account via
 * Firebase's own public Identity Toolkit REST endpoint instead of the client
 * SDK's createUserWithEmailAndPassword — that call signs the *browser* into
 * the new account, which would kick the admin out of their own session. The
 * REST call is a plain fetch, so the admin's `auth` session is untouched.
 * Throws with the Identity Toolkit error code (e.g. "EMAIL_EXISTS") as the
 * message on failure.
 */
export async function createUserByAdmin(input: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, password: input.password, returnSecureToken: false }),
    }
  );
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message ?? "UNKNOWN_ERROR");
  }
  const uid = data.localId as string;
  await setDoc(doc(db, "users", uid), {
    name: input.name,
    email: input.email,
    role: input.role,
    // Same rule as self-registration: a teacher account still needs an
    // admin's explicit approval before it counts as active, even when an
    // admin was the one who created it — creating it isn't the same as
    // approving it.
    status: input.role === "teacher" ? "pending" : "approved",
    createdAt: serverTimestamp(),
  });
  return uid;
}

export function logoutUser() {
  return firebaseSignOut(auth);
}
