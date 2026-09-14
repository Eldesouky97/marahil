"use client";

import { useEffect, useState } from "react";
import { listCourseLiveSessions } from "@/lib/firebase/liveSessions";
import type { LiveSession } from "@/types/liveSession";
import type { EnrolledCourse } from "./useStudentDashboard";

const MAX_SESSIONS = 5;

export function useUpcomingLiveSessions(enrolledCourses: EnrolledCourse[]) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const courseIds = enrolledCourses.map((e) => e.course.id).join(",");

  useEffect(() => {
    if (!courseIds) {
      setSessions([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all(courseIds.split(",").map((id) => listCourseLiveSessions(id))).then((results) => {
      if (cancelled) return;
      const upcoming = results
        .flat()
        .filter((s) => s.status === "scheduled" || s.status === "live")
        .sort((a, b) => a.scheduledAt - b.scheduledAt)
        .slice(0, MAX_SESSIONS);
      setSessions(upcoming);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [courseIds]);

  return { sessions, loading };
}
