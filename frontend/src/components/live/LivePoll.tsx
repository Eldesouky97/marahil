"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { inputClasses } from "@/components/ui/FormField";
import type { LivePoll as LivePollData } from "@/types/liveSession";

export function LivePoll({
  poll,
  tally,
  myVote,
  totalVotes,
  onVote,
  isTeacher,
  onOpenPoll,
  onClosePoll,
}: {
  poll: LivePollData | undefined;
  tally: number[];
  myVote: { optionIndex: number } | undefined;
  totalVotes: number;
  onVote: (optionIndex: number) => void;
  isTeacher: boolean;
  onOpenPoll?: (question: string, options: string[]) => void;
  onClosePoll?: () => void;
}) {
  const t = useTranslations("liveSessions");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  if (isTeacher && (!poll || !poll.active)) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-bold">
          <BarChart3 size={15} /> {t("pollTitle")}
        </h4>
        <input
          className={`${inputClasses} mb-2`}
          placeholder={t("pollQuestionPlaceholder")}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        {options.map((o, i) => (
          <input
            key={i}
            className={`${inputClasses} mb-2`}
            placeholder={t("pollOptionPlaceholder", { n: i + 1 })}
            value={o}
            onChange={(e) => setOptions(options.map((existing, idx) => (idx === i ? e.target.value : existing)))}
          />
        ))}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOptions([...options, ""])}
            className="cursor-pointer text-xs text-accent"
          >
            {t("pollAddOption")}
          </button>
          <Button
            className="px-4 py-2 text-sm"
            disabled={!question.trim() || options.filter((o) => o.trim()).length < 2}
            onClick={() => {
              onOpenPoll?.(
                question,
                options.map((o) => o.trim()).filter(Boolean)
              );
              setQuestion("");
              setOptions(["", ""]);
            }}
          >
            {t("pollLaunch")}
          </Button>
        </div>
      </div>
    );
  }

  if (!poll) return null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <h4 className="mb-1 flex items-center gap-2 text-sm font-bold">
        <BarChart3 size={15} /> {poll.question}
      </h4>
      <p className="mb-3 text-xs text-dim">{t("pollVotesCount", { count: totalVotes })}</p>
      <div className="space-y-2">
        {poll.options.map((option, i) => {
          const pct = totalVotes > 0 ? Math.round((tally[i] / totalVotes) * 100) : 0;
          const picked = myVote?.optionIndex === i;
          return (
            <button
              key={i}
              type="button"
              disabled={!poll.active || !!myVote}
              onClick={() => onVote(i)}
              className="relative block w-full overflow-hidden rounded-lg border border-border bg-surface-2 px-3 py-2 text-start text-sm disabled:cursor-default"
            >
              <span
                className="absolute inset-y-0 start-0 bg-primary/15 transition-[width]"
                style={{ width: `${pct}%` }}
              />
              <span className="relative flex items-center justify-between">
                <span className={picked ? "font-bold text-primary-strong" : ""}>{option}</span>
                <span className="text-xs text-dim">{pct}%</span>
              </span>
            </button>
          );
        })}
      </div>
      {isTeacher && poll.active && (
        <Button variant="outline" className="mt-3 px-4 py-2 text-sm" onClick={onClosePoll}>
          {t("pollClose")}
        </Button>
      )}
    </div>
  );
}
