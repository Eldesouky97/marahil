"use client";

import { useTranslations } from "next-intl";
import { Award, BarChart3, ClipboardCheck, ListChecks, MessageSquare, Video } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { Container } from "@/components/ui/Container";

const ICONS = [Video, ListChecks, ClipboardCheck, Award, BarChart3, MessageSquare];

export function FeaturesSection() {
  const t = useTranslations("features");
  const items = t.raw("items") as { title: string; desc: string }[];

  return (
    <section id="teachers" className="border-b border-border bg-bg py-24">
      <Container>
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-sm font-bold text-accent">{t("eyebrow")}</p>
          <h2 className="mb-4 font-display text-3xl text-heading">{t("title")}</h2>
          <p className="leading-relaxed text-dim">{t("description")}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <FeatureCard key={f.title} icon={ICONS[i]} title={f.title} desc={f.desc} />
          ))}
        </div>
      </Container>
    </section>
  );
}
