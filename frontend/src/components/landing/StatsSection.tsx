"use client";

import { useTranslations } from "next-intl";
import { StatItem } from "./StatItem";
import { useInView } from "@/lib/hooks/useInView";
import { Container } from "@/components/ui/Container";

const STATS = [
  { target: 1200, suffix: "+", key: "lessons" },
  { target: 8600, suffix: "+", key: "students" },
  { target: 640, suffix: "+", key: "certificates" },
  { target: 97, suffix: "%", key: "satisfaction" },
] as const;

export function StatsSection() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const t = useTranslations("stats");
  return (
    <section className="border-b border-border bg-bg-alt py-20">
      <div ref={ref}>
        <Container size="lg" className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((s) => (
            <StatItem key={s.key} target={s.target} suffix={s.suffix} label={t(s.key)} shouldStart={inView} />
          ))}
        </Container>
      </div>
    </section>
  );
}
