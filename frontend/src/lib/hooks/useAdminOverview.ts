"use client";

import { useEffect, useState } from "react";
import { listAllUsers } from "@/lib/firebase/users";
import { listAllCourses } from "@/lib/firebase/courses";
import { listAllCertificates } from "@/lib/firebase/certificates";

interface AdminOverview {
  userCount: number;
  teacherCount: number;
  studentCount: number;
  courseCount: number;
  publishedCourseCount: number;
  certificateCount: number;
}

const EMPTY: AdminOverview = {
  userCount: 0,
  teacherCount: 0,
  studentCount: 0,
  courseCount: 0,
  publishedCourseCount: 0,
  certificateCount: 0,
};

export function useAdminOverview() {
  const [overview, setOverview] = useState<AdminOverview>(EMPTY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([listAllUsers(), listAllCourses(), listAllCertificates()]).then(
      ([users, courses, certificates]) => {
        if (cancelled) return;
        setOverview({
          userCount: users.length,
          teacherCount: users.filter((u) => u.role === "teacher").length,
          studentCount: users.filter((u) => u.role === "student").length,
          courseCount: courses.length,
          publishedCourseCount: courses.filter((c) => c.published).length,
          certificateCount: certificates.length,
        });
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
    };
  }, []);

  return { ...overview, loading };
}
