"use client";

import { useTranslations } from "next-intl";
import { Hand, Users } from "lucide-react";
import type { LiveParticipant } from "@/types/liveSession";

export function LiveParticipants({ participants }: { participants: LiveParticipant[] }) {
  const t = useTranslations("liveSessions");

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
        <Users size={15} /> {t("participantsTitle", { count: participants.length })}
      </h4>
      <div className="max-h-40 space-y-1.5 overflow-y-auto">
        {participants.map((p) => (
          <div key={p.uid} className="flex items-center justify-between text-sm">
            <span className="truncate">{p.name}</span>
            {p.handRaised && <Hand size={14} className="shrink-0 text-gold-strong" />}
          </div>
        ))}
      </div>
    </div>
  );
}
