"use client";

import { useEffect, useState } from "react";
import { listCourseLiveSessions } from "@/lib/firebase/liveSessions";
import type { LiveSession } from "@/types/liveSession";

/** The soonest scheduled/live session for a course, if any — used for the course page's live banner. */
export function useCourseLiveSession(courseId: string) {
  const [session, setSession] = useState<LiveSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    listCourseLiveSessions(courseId).then((sessions) => {
      if (cancelled) return;
      const upcoming = sessions
        .filter((s) => s.status === "scheduled" || s.status === "live")
        .sort((a, b) => a.scheduledAt - b.scheduledAt);
      setSession(upcoming[0] ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  return session;
}
