"use client";

import { useEffect, useState } from "react";
import { getCourse, getLesson, listLessons } from "@/lib/firebase/courses";
import { getEnrollment, recordLessonProgress } from "@/lib/firebase/enrollments";
import { watchCertificateForCourse } from "@/lib/firebase/certificates";
import type { Course, Enrollment, Lesson } from "@/types/course";

export function useLessonPlayer(courseId: string, lessonId: string, uid: string | undefined) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState<string | null>(null);
  const [awaitingCertificate, setAwaitingCertificate] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getCourse(courseId),
      getLesson(courseId, lessonId),
      listLessons(courseId),
      uid ? getEnrollment(uid, courseId) : Promise.resolve(null),
    ]).then(([courseData, lessonData, lessonList, enrollmentData]) => {
      if (cancelled) return;
      setCourse(courseData);
      setLesson(lessonData);
      setLessons(lessonList);
      setEnrollment(enrollmentData);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId, lessonId, uid]);

  // A Cloud Function issues the certificate (backend/functions) once progress
  // hits 100% — we just watch for it to appear rather than creating it here.
  useEffect(() => {
    if (!awaitingCertificate || !uid) return;
    const unsubscribe = watchCertificateForCourse(uid, courseId, (certificate) => {
      setCertificateId(certificate.id);
      setAwaitingCertificate(false);
    });
    return unsubscribe;
  }, [awaitingCertificate, uid, courseId]);

  async function completeLesson(quizScore: number | null) {
    if (!uid) return;
    const updated = await recordLessonProgress(uid, courseId, lessonId, quizScore, lessons.length);
    setEnrollment(updated);
    if (updated.progress >= 100 && !updated.certificateIssued) setAwaitingCertificate(true);
  }

  return {
    course,
    lesson,
    lessons,
    enrollment,
    loading,
    certificateId,
    awaitingCertificate,
    completeLesson,
  };
}
