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
  const snap = await getDoc(doc(db, "enrollments", enrollmentId(uid, courseId)));
  return snap.exists() ? mapEnrollment(snap.id, snap.data()) : null;
}

export async function listStudentEnrollments(uid: string): Promise<Enrollment[]> {
  const snap = await getDocs(query(collection(db, "enrollments"), where("uid", "==", uid)));
  return snap.docs.map((d) => mapEnrollment(d.id, d.data()));
}

export async function enrollInCourse(uid: string, courseId: string): Promise<void> {
  const id = enrollmentId(uid, courseId);
  const existing = await getDoc(doc(db, "enrollments", id));
  if (existing.exists()) return;
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
