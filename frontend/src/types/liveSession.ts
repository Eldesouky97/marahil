export type LiveSessionStatus = "scheduled" | "live" | "ended";

export interface LivePoll {
  pollId: string;
  question: string;
  options: string[];
  active: boolean;
}

export interface LiveSession {
  id: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  title: string;
  status: LiveSessionStatus;
  scheduledAt: number;
  startedAt?: number;
  endedAt?: number;
  whiteboardClearedAt: number;
  poll?: LivePoll;
}

export interface LiveMessage {
  id: string;
  uid: string;
  name: string;
  text: string;
  createdAt: number;
}

export interface LiveParticipant {
  uid: string;
  name: string;
  photoURL?: string;
  handRaised: boolean;
  joinedAt: number;
  lastSeen: number;
}

export interface LiveStroke {
  id: string;
  color: string;
  size: number;
  /** Flattened [x0, y0, x1, y1, ...] pairs, normalized 0-1 relative to canvas size. */
  points: number[];
  createdAt: number;
}

export interface LivePollVote {
  uid: string;
  pollId: string;
  optionIndex: number;
}
