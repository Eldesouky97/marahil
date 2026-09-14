"use client";

import { useEffect, useState } from "react";
import { leaveLiveSession, subscribeToLiveParticipants, upsertParticipant } from "@/lib/firebase/liveSessions";
import type { LiveParticipant } from "@/types/liveSession";

const HEARTBEAT_MS = 20_000;
/** A participant with no heartbeat in this long is treated as offline — best-effort, no real disconnect detection (see backend/firestore.rules). */
const STALE_MS = 60_000;

export function useLiveParticipants(
  sessionId: string,
  active: boolean,
  uid: string | undefined,
  name: string | undefined,
  photoURL: string | undefined
) {
  const [participants, setParticipants] = useState<LiveParticipant[]>([]);
  const [handRaised, setHandRaised] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    return subscribeToLiveParticipants(sessionId, setParticipants);
  }, [sessionId]);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 5_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!active || !uid || !name) return;
    upsertParticipant(sessionId, uid, name, photoURL, handRaised);
    const interval = setInterval(() => upsertParticipant(sessionId, uid, name, photoURL, handRaised), HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, [active, sessionId, uid, name, photoURL, handRaised]);

  useEffect(() => {
    if (!active || !uid) return;
    return () => {
      leaveLiveSession(sessionId, uid);
    };
  }, [active, sessionId, uid]);

  const online = participants.filter((p) => now - p.lastSeen < STALE_MS);

  return { participants: online, handRaised, toggleHand: () => setHandRaised((v) => !v) };
}
