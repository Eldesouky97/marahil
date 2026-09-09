"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useStages } from "@/lib/hooks/useStages";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

export function StagesSection() {
  const [active, setActive] = useState(0);
  const stages = useStages();
  const t = useTranslations("stages");
  const stage = stages[active];

  return (
    <section id="stages" className="border-b border-border bg-bg-alt py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {stages.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={cn(
                "cursor-pointer rounded-full border border-border bg-surface px-4 py-2.5 text-sm text-dim transition-all hover:border-primary/30 hover:text-muted",
                i === active &&
                  "border-transparent bg-gradient-to-l from-primary to-primary-strong text-primary-ink"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {stage.subjects.map((sub) => (
            <span
              key={sub}
              className="inline-block rounded-full border border-accent/20 bg-accent/[0.08] px-5 py-2 text-sm text-accent-ink"
            >
              {sub}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
