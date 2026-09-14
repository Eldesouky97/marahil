"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { MessageSquare, Send, Trash2 } from "lucide-react";
import type { LiveMessage } from "@/types/liveSession";

export function LiveChat({
  messages,
  onSend,
  onDelete,
  canModerate,
}: {
  messages: LiveMessage[];
  onSend: (text: string) => void;
  onDelete?: (messageId: string) => void;
  canModerate: boolean;
}) {
  const t = useTranslations("liveSessions");
  const [text, setText] = useState("");
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text);
    setText("");
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-surface p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
        <MessageSquare size={15} /> {t("chatTitle")}
      </h4>
      <div ref={logRef} className="mb-3 flex-1 space-y-2 overflow-y-auto">
        {messages.map((m) => (
          <div key={m.id} className="group flex items-start justify-between gap-2 text-sm">
            <p>
              <span className="font-bold text-heading">{m.name}: </span>
              <span className="text-dim">{m.text}</span>
            </p>
            {canModerate && onDelete && (
              <button
                type="button"
                onClick={() => onDelete(m.id)}
                className="shrink-0 text-faint opacity-0 group-hover:opacity-100 hover:text-danger"
                aria-label={t("deleteMessage")}
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent/50"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t("chatPlaceholder")}
          maxLength={500}
        />
        <button type="submit" className="cursor-pointer text-primary-strong" aria-label={t("send")}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
