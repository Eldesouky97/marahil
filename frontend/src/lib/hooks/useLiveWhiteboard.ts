"use client";

import { useEffect, useState } from "react";
import { addStroke, subscribeToLiveStrokes } from "@/lib/firebase/liveSessions";
import type { LiveStroke } from "@/types/liveSession";

export function useLiveWhiteboard(sessionId: string, clearedAt: number) {
  const [strokes, setStrokes] = useState<LiveStroke[]>([]);

  useEffect(() => {
    return subscribeToLiveStrokes(sessionId, setStrokes);
  }, [sessionId]);

  const visibleStrokes = strokes.filter((s) => s.createdAt > clearedAt);

  async function draw(color: string, size: number, points: number[]) {
    if (points.length < 2) return;
    await addStroke(sessionId, color, size, points);
  }

  return { strokes: visibleStrokes, draw };
}
