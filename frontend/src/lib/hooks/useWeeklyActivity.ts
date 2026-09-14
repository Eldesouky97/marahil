"use client";

import { useEffect, useState } from "react";
import { collection, documentId, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/client";

export interface DayActivity {
  date: string;
  count: number;
}

function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

/** Last 7 days of users/{uid}/activity/{date}.count, in chronological order (oldest first, today last). Missing days are 0. */
export function useWeeklyActivity(uid: string | undefined) {
  const [days, setDays] = useState<DayActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setDays([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);

    const dates = lastNDays(7);
    getDocs(query(collection(db, "users", uid, "activity"), where(documentId(), "in", dates))).then((snap) => {
      if (cancelled) return;
      const counts = new Map(snap.docs.map((d) => [d.id, d.data().count ?? 0]));
      setDays(dates.map((date) => ({ date, count: counts.get(date) ?? 0 })));
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [uid]);

  return { days, loading, total: days.reduce((sum, d) => sum + d.count, 0) };
}
