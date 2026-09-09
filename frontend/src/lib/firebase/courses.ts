import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./client";
import type { Course, Lesson } from "@/types/course";
import type { StageId } from "@/types/stage";

const coursesRef = collection(db, "courses");

function mapCourse(id: string, data: DocumentData): Course {
  return {
    id,
    title: data.title,
    description: data.description,
    stage: data.stage,
    subject: data.subject,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    coverIcon: data.coverIcon ?? "BookOpen",
    published: !!data.published,
    lessonsCount: data.lessonsCount ?? 0,
    studentsCount: data.studentsCount ?? 0,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export async function listPublishedCourses(stage?: StageId): Promise<Course[]> {
  const constraints = stage
    ? [where("published", "==", true), where("stage", "==", stage)]
    : [where("published", "==", true)];
  const snap = await getDocs(query(coursesRef, ...constraints));
  return snap.docs.map((d) => mapCourse(d.id, d.data()));
}

export async function listTeacherCourses(teacherId: string): Promise<Course[]> {
  const snap = await getDocs(query(coursesRef, where("teacherId", "==", teacherId)));
  return snap.docs.map((d) => mapCourse(d.id, d.data()));
}

/** Admin-only (see backend/firestore.rules isAdmin()) — every course, any teacher, any publish state. */
export async function listAllCourses(): Promise<Course[]> {
  const snap = await getDocs(coursesRef);
  return snap.docs.map((d) => mapCourse(d.id, d.data()));
}

export async function getCourse(courseId: string): Promise<Course | null> {
  const snap = await getDoc(doc(db, "courses", courseId));
  return snap.exists() ? mapCourse(snap.id, snap.data()) : null;
}

export async function createCourse(input: {
  title: string;
  description: string;
  stage: StageId;
  subject: string;
  teacherId: string;
  teacherName: string;
  coverIcon: string;
}): Promise<string> {
  const created = await addDoc(coursesRef, {
    ...input,
    published: false,
    lessonsCount: 0,
    studentsCount: 0,
    createdAt: serverTimestamp(),
  });
  return created.id;
}

export async function setCoursePublished(courseId: string, published: boolean) {
  await updateDoc(doc(db, "courses", courseId), { published });
}

export async function updateCourse(
  courseId: string,
  patch: Partial<Pick<Course, "title" | "description" | "stage" | "subject">>
): Promise<void> {
  await updateDoc(doc(db, "courses", courseId), patch);
}

/** Admin-only. Deletes every lesson first (Firestore doesn't cascade-delete subcollections), then the course itself. */
export async function deleteCourse(courseId: string): Promise<void> {
  const lessonsSnap = await getDocs(collection(db, "courses", courseId, "lessons"));
  await Promise.all(lessonsSnap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(db, "courses", courseId));
}

export async function listLessons(courseId: string): Promise<Lesson[]> {
  const snap = await getDocs(collection(db, "courses", courseId, "lessons"));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as Omit<Lesson, "id">) }))
    .sort((a, b) => a.order - b.order);
}

export async function getLesson(courseId: string, lessonId: string): Promise<Lesson | null> {
  const snap = await getDoc(doc(db, "courses", courseId, "lessons", lessonId));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as Omit<Lesson, "id">) }) : null;
}

export async function addLesson(
  courseId: string,
  lesson: Omit<Lesson, "id">
): Promise<string> {
  const created = await addDoc(collection(db, "courses", courseId, "lessons"), lesson);
  await updateDoc(doc(db, "courses", courseId), {
    lessonsCount: (await listLessons(courseId)).length,
  });
  return created.id;
}

export async function updateLesson(
  courseId: string,
  lessonId: string,
  patch: Partial<Omit<Lesson, "id">>
): Promise<void> {
  await updateDoc(doc(db, "courses", courseId, "lessons", lessonId), patch);
}

export async function deleteLesson(courseId: string, lessonId: string): Promise<void> {
  await deleteDoc(doc(db, "courses", courseId, "lessons", lessonId));
  await updateDoc(doc(db, "courses", courseId), {
    lessonsCount: (await listLessons(courseId)).length,
  });
}
