"use client";

import { useTranslations } from "next-intl";
import { Award, BookOpen, ClipboardCheck, Video } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ScrollReveal } from "./ScrollReveal";
import { Container } from "@/components/ui/Container";

const ICONS = [Video, BookOpen, ClipboardCheck, Award];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const steps = t.raw("steps") as { n: string; title: string; desc: string }[];

  return (
    <section id="how" className="border-b border-border bg-bg py-24">
      <Container>
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} />

        <ScrollReveal className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute top-8 right-[12%] left-[12%] hidden border-t-2 border-dashed border-primary/25 md:block" />
          {steps.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <div key={s.n} className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-surface">
                  <span className="font-display text-xl text-primary">{s.n}</span>
                </div>
                <Icon size={22} className="mb-3 text-accent" />
                <h3 className="mb-2 font-bold">{s.title}</h3>
                <p className="max-w-56 text-sm leading-relaxed text-dim">{s.desc}</p>
              </div>
            );
          })}
        </ScrollReveal>
      </Container>
    </section>
  );
}
