"use client";

import { useEffect, useMemo, useState } from "react";
import { castPollVote, subscribeToPollVotes } from "@/lib/firebase/liveSessions";
import type { LivePoll, LivePollVote } from "@/types/liveSession";

export function useLivePoll(sessionId: string, poll: LivePoll | undefined, uid: string | undefined) {
  const [votes, setVotes] = useState<LivePollVote[]>([]);

  useEffect(() => {
    return subscribeToPollVotes(sessionId, setVotes);
  }, [sessionId]);

  const currentVotes = useMemo(() => (poll ? votes.filter((v) => v.pollId === poll.pollId) : []), [votes, poll]);
  const myVote = currentVotes.find((v) => v.uid === uid);
  const tally = poll ? poll.options.map((_, i) => currentVotes.filter((v) => v.optionIndex === i).length) : [];

  async function vote(optionIndex: number) {
    if (!poll || !uid) return;
    await castPollVote(sessionId, uid, poll.pollId, optionIndex);
  }

  return { tally, myVote, totalVotes: currentVotes.length, vote };
}
