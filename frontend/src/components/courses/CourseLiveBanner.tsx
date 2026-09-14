"use client";

import { useTranslations } from "next-intl";
import { Radio } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import type { LiveSession } from "@/types/liveSession";

export function CourseLiveBanner({ session }: { session: LiveSession | null }) {
  const t = useTranslations("liveSessions");

  if (!session) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-danger/25 bg-danger/5 p-4">
      <span className="flex items-center gap-1.5 rounded-full bg-danger/10 px-3 py-1 text-xs font-bold text-danger">
        <Radio size={13} /> {session.status === "live" ? t("liveBadge") : t("upcomingBadge")}
      </span>
      <div className="flex-1">
        <p className="font-bold text-heading">{session.title}</p>
        {session.status !== "live" && (
          <p className="text-xs text-dim">{new Date(session.scheduledAt).toLocaleString()}</p>
        )}
      </div>
      <Link href={`/live/${session.id}`}>
        <Button className="px-4 py-2 text-sm">{t("enterRoom")}</Button>
      </Link>
    </div>
  );
}
