"use client";

import { StatItem } from "./StatItem";
import { useInView } from "@/lib/hooks/useInView";
import { Container } from "@/components/ui/Container";

const STATS = [
  { target: 1200, suffix: "+", label: "درس منشور" },
  { target: 8600, suffix: "+", label: "طالب نشط" },
  { target: 640, suffix: "+", label: "شهادة صادرة" },
  { target: 97, suffix: "%", label: "نسبة رضا المعلمين" },
];

export function StatsSection() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  return (
    <section className="border-b border-white/[0.06] bg-[#080D1A] py-20">
      <div ref={ref}>
        <Container size="lg" className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} shouldStart={inView} />
          ))}
        </Container>
      </div>
    </section>
  );
}
