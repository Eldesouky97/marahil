"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function TeacherPitch() {
  const t = useTranslations("teacherPitch");
  const points = t.raw("points") as string[];
  const stats = t.raw("stats") as { value: string; label: string }[];

  return (
    <section id="for-teachers" className="border-b border-border bg-bg-alt py-24">
      <Container size="lg" className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold text-accent">{t("eyebrow")}</p>
          <h2 className="mb-4 font-display text-3xl text-heading">{t("title")}</h2>
          <p className="mb-8 leading-relaxed text-dim">{t("description")}</p>
          <ul className="mb-8 space-y-3">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 shrink-0 text-accent" size={18} />
                <span className="text-sm text-body">{p}</span>
              </li>
            ))}
          </ul>
          <Link href="/auth/register?role=teacher">
            <Button>
              <GraduationCap size={18} /> {t("ctaTeacher")}
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-6 text-center">
              <div className="mb-1 font-display text-2xl text-primary">{s.value}</div>
              <div className="text-xs text-dim">{s.label}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
