"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, PlayCircle, Sparkles } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Constellation } from "./Constellation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      style={{
        background: "radial-gradient(ellipse at 50% -10%, var(--surface-3) 0%, var(--bg) 55%, var(--bg-alt) 100%)",
      }}
    >
      <Constellation />

      <Container className="relative py-24 text-center sm:py-28" size="lg">
        <Badge className="mb-8">
          <Sparkles size={14} /> {t("badge")}
        </Badge>

        <h1 className="mb-6 font-display text-4xl leading-snug text-heading sm:text-5xl">{t("title")}</h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-loose text-muted">{t("subtitle")}</p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/register?role=teacher">
            <Button className="group">
              {t("ctaTeacher")}
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1"
              />
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline">
              <PlayCircle size={18} /> {t("ctaStudent")}
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
