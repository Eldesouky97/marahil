"use client";

import { useEffect, useState } from "react";
import { subscribeToLiveSession } from "@/lib/firebase/liveSessions";
import type { LiveSession } from "@/types/liveSession";

export function useLiveSession(sessionId: string) {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToLiveSession(sessionId, (data) => {
      setSession(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [sessionId]);

  return { session, loading };
}
