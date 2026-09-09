import { doc, getDoc } from "firebase/firestore";
import { db } from "./client";
import type { AppUser } from "@/types/user";

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    uid,
    name: data.name,
    email: data.email,
    role: data.role,
    photoURL: data.photoURL,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}
