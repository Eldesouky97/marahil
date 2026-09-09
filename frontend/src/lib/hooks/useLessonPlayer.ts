"use client";

import { useEffect, useState } from "react";
import { getCourse, getLesson, listLessons } from "@/lib/firebase/courses";
import { getEnrollment, recordLessonProgress } from "@/lib/firebase/enrollments";
import { issueCertificate } from "@/lib/firebase/certificates";
import type { Course, Enrollment, Lesson } from "@/types/course";

export function useLessonPlayer(
  courseId: string,
  lessonId: string,
  uid: string | undefined,
  studentName: string | undefined
) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [certificateId, setCertificateId] = useState<string | null>(null);

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

  async function completeLesson(quizScore: number | null) {
    if (!uid || !course) return;
    const updated = await recordLessonProgress(uid, courseId, lessonId, quizScore, lessons.length);
    setEnrollment(updated);

    if (updated.progress >= 100 && !updated.certificateIssued && studentName) {
      const certificate = await issueCertificate({
        uid,
        studentName,
        courseId: course.id,
        courseTitle: course.title,
        teacherName: course.teacherName,
      });
      setCertificateId(certificate.id);
    }
  }

  return { course, lesson, lessons, enrollment, loading, certificateId, completeLesson };
}
