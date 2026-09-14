"use client";

import { useEffect, useState } from "react";
import { sendLiveMessage, subscribeToLiveMessages, deleteLiveMessage } from "@/lib/firebase/liveSessions";
import type { LiveMessage } from "@/types/liveSession";

export function useLiveChat(sessionId: string) {
  const [messages, setMessages] = useState<LiveMessage[]>([]);

  useEffect(() => {
    return subscribeToLiveMessages(sessionId, setMessages);
  }, [sessionId]);

  async function send(uid: string, name: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    await sendLiveMessage(sessionId, uid, name, trimmed.slice(0, 500));
  }

  async function remove(messageId: string) {
    await deleteLiveMessage(sessionId, messageId);
  }

  return { messages, send, remove };
}
