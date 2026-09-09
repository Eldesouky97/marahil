import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  collection,
  query,
  where,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "./client";
import type { Enrollment } from "@/types/course";

function enrollmentId(uid: string, courseId: string) {
  return `${uid}_${courseId}`;
}

function mapEnrollment(id: string, data: DocumentData): Enrollment {
  return {
    id,
    uid: data.uid,
    courseId: data.courseId,
    completedLessonIds: data.completedLessonIds ?? [],
    quizScores: data.quizScores ?? {},
    progress: data.progress ?? 0,
    certificateIssued: !!data.certificateIssued,
    enrolledAt: data.enrolledAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),
  };
}

export async function getEnrollment(uid: string, courseId: string): Promise<Enrollment | null> {
  try {
    const snap = await getDoc(doc(db, "enrollments", enrollmentId(uid, courseId)));
    return snap.exists() ? mapEnrollment(snap.id, snap.data()) : null;
  } catch {
    // Firestore rules read this doc's own field (isOwner(resource.data.uid)) to
    // decide access, so a not-yet-existing enrollment (a student who hasn't
    // enrolled yet) denies with permission-denied rather than "not found" —
    // that always means "not enrolled" here, since the id is the deterministic
    // "{uid}_{courseId}" scheme and only the owner ever requests their own.
    return null;
  }
}

export async function listStudentEnrollments(uid: string): Promise<Enrollment[]> {
  const snap = await getDocs(query(collection(db, "enrollments"), where("uid", "==", uid)));
  return snap.docs.map((d) => mapEnrollment(d.id, d.data()));
}

export async function enrollInCourse(uid: string, courseId: string): Promise<void> {
  const id = enrollmentId(uid, courseId);
  const existing = await getEnrollment(uid, courseId);
  if (existing) return;
  await setDoc(doc(db, "enrollments", id), {
    uid,
    courseId,
    completedLessonIds: [],
    quizScores: {},
    progress: 0,
    certificateIssued: false,
    enrolledAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function recordLessonProgress(
  uid: string,
  courseId: string,
  lessonId: string,
  quizScore: number | null,
  totalLessons: number
): Promise<Enrollment> {
  const id = enrollmentId(uid, courseId);
  const current = await getEnrollment(uid, courseId);
  const completedLessonIds = Array.from(
    new Set([...(current?.completedLessonIds ?? []), lessonId])
  );
  const quizScores = { ...(current?.quizScores ?? {}) };
  if (quizScore !== null) quizScores[lessonId] = quizScore;

  const progress = totalLessons > 0
    ? Math.round((completedLessonIds.length / totalLessons) * 100)
    : 0;

  await setDoc(
    doc(db, "enrollments", id),
    { uid, courseId, completedLessonIds, quizScores, progress, updatedAt: serverTimestamp() },
    { merge: true }
  );

  return {
    id,
    uid,
    courseId,
    completedLessonIds,
    quizScores,
    progress,
    certificateIssued: current?.certificateIssued ?? false,
    enrolledAt: current?.enrolledAt ?? Date.now(),
    updatedAt: Date.now(),
  };
}
