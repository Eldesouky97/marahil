import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./client";
import type {
  LiveMessage,
  LiveParticipant,
  LivePoll,
  LivePollVote,
  LiveSession,
  LiveSessionStatus,
  LiveStroke,
} from "@/types/liveSession";

/**
 * This is the first file in the codebase to use onSnapshot — a deliberate,
 * scoped exception to the one-shot-read (getDoc/getDocs) convention used
 * everywhere else (see lib/firebase/courses.ts, enrollments.ts, etc.). Live
 * chat/whiteboard/poll tallies genuinely need realtime updates; nothing else
 * in the app does, so this stays isolated to live-session code.
 */

function sessionsRef() {
  return collection(db, "liveSessions");
}

function mapSession(id: string, data: DocumentData): LiveSession {
  return {
    id,
    courseId: data.courseId,
    courseTitle: data.courseTitle,
    teacherId: data.teacherId,
    teacherName: data.teacherName,
    title: data.title,
    status: data.status,
    scheduledAt: data.scheduledAt?.toMillis?.() ?? Date.now(),
    startedAt: data.startedAt?.toMillis?.(),
    endedAt: data.endedAt?.toMillis?.(),
    whiteboardClearedAt: data.whiteboardClearedAt?.toMillis?.() ?? 0,
    poll: data.poll,
  };
}

// --- session CRUD --------------------------------------------------------

export async function createLiveSession(input: {
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  title: string;
  scheduledAt: number;
}): Promise<string> {
  const created = await addDoc(sessionsRef(), {
    ...input,
    scheduledAt: Timestamp.fromMillis(input.scheduledAt),
    status: "scheduled" as LiveSessionStatus,
    whiteboardClearedAt: serverTimestamp(),
  });
  return created.id;
}

export async function getLiveSession(sessionId: string): Promise<LiveSession | null> {
  const snap = await getDoc(doc(db, "liveSessions", sessionId));
  return snap.exists() ? mapSession(snap.id, snap.data()) : null;
}

export async function listCourseLiveSessions(courseId: string): Promise<LiveSession[]> {
  const snap = await getDocs(query(sessionsRef(), where("courseId", "==", courseId)));
  return snap.docs.map((d) => mapSession(d.id, d.data()));
}

export async function listTeacherLiveSessions(teacherId: string): Promise<LiveSession[]> {
  const snap = await getDocs(query(sessionsRef(), where("teacherId", "==", teacherId)));
  return snap.docs.map((d) => mapSession(d.id, d.data()));
}

export function subscribeToLiveSession(sessionId: string, cb: (session: LiveSession | null) => void) {
  return onSnapshot(doc(db, "liveSessions", sessionId), (snap) => {
    cb(snap.exists() ? mapSession(snap.id, snap.data()) : null);
  });
}

export async function startLiveSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "liveSessions", sessionId), { status: "live", startedAt: serverTimestamp() });
}

export async function endLiveSession(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "liveSessions", sessionId), { status: "ended", endedAt: serverTimestamp() });
}

export async function deleteLiveSession(sessionId: string): Promise<void> {
  await deleteDoc(doc(db, "liveSessions", sessionId));
}

export async function clearWhiteboard(sessionId: string): Promise<void> {
  await updateDoc(doc(db, "liveSessions", sessionId), { whiteboardClearedAt: serverTimestamp() });
}

export async function openPoll(sessionId: string, question: string, options: string[]): Promise<void> {
  const poll: LivePoll = { pollId: crypto.randomUUID(), question, options, active: true };
  await updateDoc(doc(db, "liveSessions", sessionId), { poll });
}

export async function closePoll(sessionId: string, poll: LivePoll): Promise<void> {
  await updateDoc(doc(db, "liveSessions", sessionId), { poll: { ...poll, active: false } });
}

// --- chat ------------------------------------------------------------

function mapMessage(id: string, data: DocumentData): LiveMessage {
  return { id, uid: data.uid, name: data.name, text: data.text, createdAt: data.createdAt?.toMillis?.() ?? Date.now() };
}

export function subscribeToLiveMessages(sessionId: string, cb: (messages: LiveMessage[]) => void) {
  const q = query(collection(db, "liveSessions", sessionId, "messages"), orderBy("createdAt"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => mapMessage(d.id, d.data()))));
}

export async function sendLiveMessage(sessionId: string, uid: string, name: string, text: string): Promise<void> {
  await addDoc(collection(db, "liveSessions", sessionId, "messages"), { uid, name, text, createdAt: serverTimestamp() });
}

export async function deleteLiveMessage(sessionId: string, messageId: string): Promise<void> {
  await deleteDoc(doc(db, "liveSessions", sessionId, "messages", messageId));
}

// --- participants / presence / hand-raise --------------------------------

function mapParticipant(data: DocumentData): LiveParticipant {
  return {
    uid: data.uid,
    name: data.name,
    photoURL: data.photoURL,
    handRaised: !!data.handRaised,
    joinedAt: data.joinedAt?.toMillis?.() ?? Date.now(),
    lastSeen: data.lastSeen?.toMillis?.() ?? Date.now(),
  };
}

export function subscribeToLiveParticipants(sessionId: string, cb: (participants: LiveParticipant[]) => void) {
  return onSnapshot(collection(db, "liveSessions", sessionId, "participants"), (snap) => {
    cb(snap.docs.map((d) => mapParticipant(d.data())));
  });
}

/** Heartbeat — call on join and every ~20s while the session view is open. */
export async function upsertParticipant(
  sessionId: string,
  uid: string,
  name: string,
  photoURL: string | undefined,
  handRaised: boolean
): Promise<void> {
  const ref = doc(db, "liveSessions", sessionId, "participants", uid);
  const existing = await getDoc(ref);
  await setDoc(
    ref,
    {
      uid,
      name,
      ...(photoURL ? { photoURL } : {}),
      handRaised,
      joinedAt: existing.exists() ? existing.data().joinedAt : serverTimestamp(),
      lastSeen: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function leaveLiveSession(sessionId: string, uid: string): Promise<void> {
  await deleteDoc(doc(db, "liveSessions", sessionId, "participants", uid));
}

// --- whiteboard strokes ----------------------------------------------

function mapStroke(id: string, data: DocumentData): LiveStroke {
  return {
    id,
    color: data.color,
    size: data.size,
    points: data.points,
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
  };
}

export function subscribeToLiveStrokes(sessionId: string, cb: (strokes: LiveStroke[]) => void) {
  const q = query(collection(db, "liveSessions", sessionId, "strokes"), orderBy("createdAt"));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => mapStroke(d.id, d.data()))));
}

export async function addStroke(sessionId: string, color: string, size: number, points: number[]): Promise<void> {
  await addDoc(collection(db, "liveSessions", sessionId, "strokes"), { color, size, points, createdAt: serverTimestamp() });
}

// --- poll votes ------------------------------------------------------

export function subscribeToPollVotes(sessionId: string, cb: (votes: LivePollVote[]) => void) {
  return onSnapshot(collection(db, "liveSessions", sessionId, "pollVotes"), (snap) => {
    cb(snap.docs.map((d) => ({ uid: d.id, pollId: d.data().pollId, optionIndex: d.data().optionIndex })));
  });
}

export async function castPollVote(sessionId: string, uid: string, pollId: string, optionIndex: number): Promise<void> {
  await setDoc(doc(db, "liveSessions", sessionId, "pollVotes", uid), { pollId, optionIndex });
}
