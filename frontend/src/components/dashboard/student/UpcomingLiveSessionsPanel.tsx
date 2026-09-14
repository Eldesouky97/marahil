"use client";

import { useTranslations } from "next-intl";
import { Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import type { LiveSession } from "@/types/liveSession";

export function UpcomingLiveSessionsPanel({ sessions }: { sessions: LiveSession[] }) {
  const t = useTranslations("liveSessions");

  if (sessions.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold">{t("upcomingTitle")}</h2>
      <div className="space-y-3">
        {sessions.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="flex items-center gap-2 font-medium">
                {s.status === "live" && <Radio size={14} className="text-danger" />}
                {s.title}
              </p>
              <p className="mt-1 text-xs text-dim">
                {s.courseTitle} — {new Date(s.scheduledAt).toLocaleString()}
              </p>
            </div>
            {s.status === "live" ? (
              <Link href={`/live/${s.id}`}>
                <Button className="px-4 py-2 text-sm">{t("enterRoom")}</Button>
              </Link>
            ) : (
              <span className="text-xs text-faint">{t("status.scheduled")}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
