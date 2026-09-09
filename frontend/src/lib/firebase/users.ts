import { collection, doc, DocumentData, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./client";
import type { AppUser, UserRole } from "@/types/user";

function mapUser(uid: string, data: DocumentData): AppUser {
  return {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? mapUser(uid, snap.data()) : null;
}

export async function createUserProfile(
  uid: string,
  input: { name: string; email: string; role: UserRole }
): Promise<void> {
  await setDoc(doc(db, "users", uid), { ...input, createdAt: serverTimestamp() });
}

/** Admin-only (see backend/firestore.rules isAdmin()) — lists every user for the admin dashboard. */
export async function listAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => mapUser(d.id, d.data()));
}

/**
 * Admin-only. Only changes the `role` field — there's no way to delete a
 * Firebase Auth account from the client (needs the Admin SDK, which this
 * no-backend project doesn't have). To fully remove a user, an admin has to
 * do it manually via the Firebase Console.
 */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, "users", uid), { role });
}
