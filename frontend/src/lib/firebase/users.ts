import {
  collection,
  deleteDoc,
  deleteField,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./client";
import type { AppUser, PersonalDetails, UserRole, UserStatus } from "@/types/user";

const OPTIONAL_DETAIL_KEYS: (keyof PersonalDetails)[] = [
  "phone",
  "age",
  "governorate",
  "stage",
  "school",
  "subject",
  "workplace",
  "jobTitle",
  "nationalId",
];

/** Firestore's `setDoc`/`updateDoc` throw on an explicit `undefined` field — drop those instead of sending them. */
function withoutUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined)) as Partial<T>;
}

function mapUser(uid: string, data: DocumentData): AppUser {
  return {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    disabled: data.disabled === true,
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
    nationalId: data.nationalId,
  };
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? mapUser(uid, snap.data()) : null;
}

export async function createUserProfile(
  uid: string,
  input: { name: string; email: string; role: UserRole; photoURL?: string } & PersonalDetails
): Promise<void> {
  const status: UserStatus = input.role === "teacher" ? "pending" : "approved";
  await setDoc(doc(db, "users", uid), { ...withoutUndefined(input), status, createdAt: serverTimestamp() });
}

/** Admin-only (see backend/firestore.rules isAdmin()) — lists every user for the admin dashboard. */
export async function listAllUsers(): Promise<AppUser[]> {
  const snap = await getDocs(collection(db, "users"));
  return snap.docs.map((d) => mapUser(d.id, d.data()));
}

/** Admin-only. */
export async function updateUserRole(uid: string, role: UserRole): Promise<void> {
  await updateDoc(doc(db, "users", uid), { role });
}

/** Admin-only — approves a pending teacher (see backend/firestore.rules isApproved()). */
export async function updateUserStatus(uid: string, status: UserStatus): Promise<void> {
  await updateDoc(doc(db, "users", uid), { status });
}

/**
 * Admin-only. Flips the kill switch that blocks a user from signing into any
 * dashboard and from writing courses/lessons/enrollments (see isApproved() in
 * backend/firestore.rules) — the closest this no-backend project can get to
 * "delete" without the Admin SDK. Rejected by the rules for the protected
 * account (see lib/constants.ts).
 */
export async function setUserDisabled(uid: string, disabled: boolean): Promise<void> {
  await updateDoc(doc(db, "users", uid), { disabled });
}

export async function updateUserPhoto(uid: string, photoURL: string): Promise<void> {
  await updateDoc(doc(db, "users", uid), { photoURL });
}

/**
 * Self-service (ProfileEditForm) — updates the caller's own name and
 * personal details. Never touches role/status/disabled, so it's always
 * allowed by the owner branch of the `users` update rule regardless of who's
 * calling it. An optional detail field left empty removes it from the doc
 * (via `deleteField()`) instead of silently keeping the old value.
 */
export async function updateUserProfileFields(uid: string, fields: { name: string } & PersonalDetails): Promise<void> {
  const payload: Record<string, unknown> = { name: fields.name };
  for (const key of OPTIONAL_DETAIL_KEYS) {
    const value = fields[key];
    payload[key] = value === undefined || value === "" ? deleteField() : value;
  }
  await updateDoc(doc(db, "users", uid), payload);
}

/**
 * Admin-only, rejected for the protected account (see backend/firestore.rules
 * isProtectedAccount()). Only removes the `users/{uid}` Firestore doc — the
 * underlying Firebase Auth account survives (needs the Admin SDK to remove,
 * which this project doesn't have) and enrollments/certificates aren't
 * cascade-deleted, so a certificate the user earned stays valid/verifiable.
 */
export async function deleteUserProfile(uid: string): Promise<void> {
  await deleteDoc(doc(db, "users", uid));
}
