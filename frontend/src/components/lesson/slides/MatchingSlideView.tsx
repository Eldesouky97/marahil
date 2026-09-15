"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import type { MatchingSlide } from "@/types/lessonSlide";

function shuffled<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MatchingSlideView({ slide }: { slide: MatchingSlide }) {
  const t = useTranslations("lesson.slideDeck");
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [armedRightId, setArmedRightId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const rightItems = useMemo(() => shuffled(slide.pairs.map((p) => ({ id: p.id, text: p.right }))), [slide.pairs]);
  const assignedRightIds = new Set(Object.values(matches));
  const availableRight = rightItems.filter((r) => !assignedRightIds.has(r.id));

  function assign(leftId: string, rightId: string) {
    setMatches((prev) => {
      const next: Record<string, string> = {};
      for (const [key, value] of Object.entries(prev)) {
        if (value !== rightId) next[key] = value;
      }
      next[leftId] = rightId;
      return next;
    });
    setArmedRightId(null);
    setChecked(false);
  }

  function unassign(leftId: string) {
    setMatches((prev) => {
      const next = { ...prev };
      delete next[leftId];
      return next;
    });
    setChecked(false);
  }

  function handleLeftClick(leftId: string) {
    if (armedRightId) {
      assign(leftId, armedRightId);
    } else if (matches[leftId]) {
      unassign(leftId);
    }
  }

  function handleRightClick(rightId: string) {
    setArmedRightId((cur) => (cur === rightId ? null : rightId));
  }

  function reset() {
    setMatches({});
    setArmedRightId(null);
    setChecked(false);
  }

  const score = slide.pairs.filter((p) => matches[p.id] === p.id).length;
  const allPlaced = Object.keys(matches).length === slide.pairs.length;

  return (
    <div>
      {slide.title && <h3 className="mb-4 font-display text-xl text-heading">{slide.title}</h3>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          {slide.pairs.map((pair) => {
            const rightId = matches[pair.id];
            const rightText = rightId ? rightItems.find((r) => r.id === rightId)?.text : null;
            const isCorrect = checked && rightId === pair.id;
            const isWrong = checked && rightId !== undefined && rightId !== pair.id;
            return (
              <div
                key={pair.id}
                onClick={() => handleLeftClick(pair.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (draggingId) {
                    assign(pair.id, draggingId);
                    setDraggingId(null);
                  }
                }}
                className={cn(
                  "flex min-h-14 cursor-pointer items-center justify-between gap-2 rounded-xl border border-border-strong bg-surface px-4 py-3 text-sm transition-colors",
                  isCorrect && "border-accent/50 bg-accent/[0.1]",
                  isWrong && "border-danger/45 bg-danger/[0.1]"
                )}
              >
                <span>{pair.left}</span>
                {rightText && <span className="text-dim">{rightText}</span>}
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          {availableRight.map((right) => (
            <div
              key={right.id}
              draggable
              onDragStart={() => setDraggingId(right.id)}
              onClick={() => handleRightClick(right.id)}
              className={cn(
                "cursor-pointer rounded-xl border px-4 py-3 text-sm transition-colors",
                armedRightId === right.id ? "border-accent bg-accent/10" : "border-border-strong bg-surface"
              )}
            >
              {right.text}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={reset} className="px-4 py-2 text-sm">
          {t("reset")}
        </Button>
        <Button onClick={() => setChecked(true)} disabled={!allPlaced} className="px-4 py-2 text-sm">
          {t("checkAnswers")}
        </Button>
        {checked && <span className="text-sm text-dim">{t("matchingScore", { score, total: slide.pairs.length })}</span>}
      </div>
    </div>
  );
}
