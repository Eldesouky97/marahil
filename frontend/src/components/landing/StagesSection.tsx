"use client";

import { useState } from "react";
import { STAGES } from "@/data/stages";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils/cn";

export function StagesSection() {
  const [active, setActive] = useState(0);
  const stage = STAGES[active];

  return (
    <section id="stages" className="border-b border-white/[0.06] bg-[#080D1A] py-24">
      <Container>
        <SectionHeading
          eyebrow="كل المراحل، كل المواد"
          title="منهج واحد لكل عمر، ولكل مادة"
          description="من رياض الأطفال إلى الجامعة والتدريب المهني، تُبنى كل مادة بنفس السهولة وتظهر بنفس الجودة."
        />

        <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {STAGES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setActive(i)}
              className={cn(
                "cursor-pointer rounded-full border border-white/[0.06] bg-[#141F38] px-4 py-2.5 text-sm text-[#8A93A6] transition-all hover:border-[#D4A94F]/30 hover:text-[#C7CEE3]",
                i === active &&
                  "border-transparent bg-gradient-to-l from-[#D4A94F] to-[#E8C878] text-[#241A05]"
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
              className="inline-block rounded-full border border-[#3FBFAE]/20 bg-[#3FBFAE]/[0.08] px-5 py-2 text-sm text-[#B9E8E0]"
            >
              {sub}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
