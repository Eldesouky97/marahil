import { getTranslations } from "next-intl/server";
import { Star } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { Container } from "@/components/ui/Container";

export async function Testimonial() {
  const t = await getTranslations("testimonial");
  return (
    <section className="border-b border-border bg-bg py-24">
      <Container size="lg" className="text-center">
        <ScrollReveal stagger={0.15}>
          <div className="mb-6 flex justify-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={16} className="fill-primary text-primary" />
            ))}
          </div>
          <p className="mb-8 font-display text-2xl leading-loose text-heading">&ldquo;{t("quote")}&rdquo;</p>
          <p className="font-bold">{t("name")}</p>
          <p className="text-sm text-dim">{t("role")}</p>
        </ScrollReveal>
      </Container>
    </section>
  );
}
