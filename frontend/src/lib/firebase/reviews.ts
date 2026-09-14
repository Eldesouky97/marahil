import { collection, doc, DocumentData, getDoc, getDocs, query, serverTimestamp, setDoc, where } from "firebase/firestore";
import { db } from "./client";
import type { Review } from "@/types/review";

const reviewsRef = collection(db, "reviews");

function reviewId(uid: string, courseId: string) {
  return `${uid}_${courseId}`;
}

function mapReview(id: string, data: DocumentData): Review {
  return {
    id,
    uid: data.uid,
    studentName: data.studentName,
    courseId: data.courseId,
    courseTitle: data.courseTitle,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function listCourseReviews(courseId: string): Promise<Review[]> {
  const snap = await getDocs(query(reviewsRef, where("courseId", "==", courseId)));
  return snap.docs.map((d) => mapReview(d.id, d.data()));
}

export async function getUserReview(uid: string, courseId: string): Promise<Review | null> {
  try {
    const snap = await getDoc(doc(db, "reviews", reviewId(uid, courseId)));
    return snap.exists() ? mapReview(snap.id, snap.data()) : null;
  } catch {
    // Same "permission-denied means it doesn't exist" reasoning as
    // getEnrollment() — the rules read this doc's own uid field.
    return null;
  }
}

/**
 * Immutable — one review per student per course, ever (id is the same
 * "{uid}_{courseId}" scheme as enrollments/certificates). Firestore rules
 * require the matching enrollment to already be at 100% progress and copy
 * studentName/courseTitle from the real user/course docs, same
 * get()-verified pattern as issueCertificate(). No update/delete path is
 * exposed client-side — see backend/firestore.rules for why an aggregate
 * rating field on Course isn't used instead (can't be verified atomically
 * against this doc within Firestore rules alone).
 */
export async function createReview(input: {
  uid: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  rating: number;
  comment?: string;
}): Promise<void> {
  const ref = doc(db, "reviews", reviewId(input.uid, input.courseId));
  const payload: DocumentData = {
    uid: input.uid,
    studentName: input.studentName,
    courseId: input.courseId,
    courseTitle: input.courseTitle,
    rating: input.rating,
    createdAt: serverTimestamp(),
  };
  if (input.comment) payload.comment = input.comment;
  await setDoc(ref, payload);
}
