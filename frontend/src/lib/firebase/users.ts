import { collection, doc, DocumentData, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./client";
import type { AppUser, PersonalDetails, UserRole, UserStatus } from "@/types/user";

function mapUser(uid: string, data: DocumentData): AppUser {
  return {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    phone: data.phone,
    age: data.age,
    governorate: data.governorate,
    stage: data.stage,
    school: data.school,
    subject: data.subject,
    workplace: data.workplace,
    jobTitle: data.jobTitle,
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? mapUser(uid, snap.data()) : null;
}

export async function createUserProfile(
  uid: string,
  input: { name: string; email: string; role: UserRole } & PersonalDetails
): Promise<void> {
  const status: UserStatus = input.role === "teacher" ? "pending" : "approved";
  await setDoc(doc(db, "users", uid), { ...input, status, createdAt: serverTimestamp() });
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

/** Admin-only — approves a pending teacher (see backend/firestore.rules isApproved()). */
export async function updateUserStatus(uid: string, status: UserStatus): Promise<void> {
  await updateDoc(doc(db, "users", uid), { status });
}

export async function updateUserPhoto(uid: string, photoURL: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { photoURL });
}
