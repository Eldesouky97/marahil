"use client";

import { useEffect, useState } from "react";
import { listStudentEnrollments } from "@/lib/firebase/enrollments";
import { listStudentCertificates } from "@/lib/firebase/certificates";
import { getCourse } from "@/lib/firebase/courses";
import type { Course, Enrollment } from "@/types/course";
import type { Certificate } from "@/types/certificate";

export interface EnrolledCourse {
  enrollment: Enrollment;
  course: Course;
}

export function useStudentDashboard(uid: string | undefined) {
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setEnrolledCourses([]);
      setCertificates([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    Promise.all([listStudentEnrollments(uid), listStudentCertificates(uid)]).then(
      async ([enrollments, certs]) => {
        const courses = await Promise.all(
          enrollments.map(async (enrollment) => ({
            enrollment,
            course: await getCourse(enrollment.courseId),
          }))
        );
        if (cancelled) return;
        setEnrolledCourses(courses.filter((c): c is EnrolledCourse => !!c.course));
        setCertificates(certs);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { enrolledCourses, certificates, loading };
}
