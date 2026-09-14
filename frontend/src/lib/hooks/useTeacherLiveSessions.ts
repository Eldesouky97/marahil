"use client";

import { useCallback, useEffect, useState } from "react";
import { listTeacherLiveSessions } from "@/lib/firebase/liveSessions";
import type { LiveSession } from "@/types/liveSession";

export function useTeacherLiveSessions(teacherId: string | undefined) {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!teacherId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await listTeacherLiveSessions(teacherId);
    setSessions(data.sort((a, b) => a.scheduledAt - b.scheduledAt));
    setLoading(false);
  }, [teacherId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { sessions, loading, refresh };
}
