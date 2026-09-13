"use client";

import { useStages } from "@/lib/hooks/useStages";

export function SubjectMarquee() {
  const stages = useStages();
  const subjects = [...new Set(stages.flatMap((s) => s.subjects))];

  if (subjects.length === 0) return null;

  return (
    <div className="overflow-hidden border-y border-border bg-surface-inverse py-4">
      <div className="flex w-max animate-[marquee_30s_linear_infinite] motion-reduce:animate-none">
        {[0, 1].map((track) => (
          <div key={track} className="flex shrink-0 items-center gap-8 px-4" aria-hidden={track === 1}>
            {subjects.map((subject, i) => (
              <span key={i} className="flex items-center gap-8 whitespace-nowrap text-sm text-surface-inverse-ink/70">
                {subject}
                <span className="text-gold">•</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
