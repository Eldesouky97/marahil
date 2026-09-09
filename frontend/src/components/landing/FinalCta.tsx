import { getTranslations } from "next-intl/server";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export async function FinalCta() {
  const t = await getTranslations("cta");
  return (
    <section
      className="py-24"
      style={{ background: "radial-gradient(ellipse at 50% 100%, var(--surface-3) 0%, var(--bg) 60%)" }}
    >
      <Container size="lg" className="text-center">
        <h2 className="mb-5 font-display text-3xl text-heading">{t("title")}</h2>
        <p className="mb-9 leading-relaxed text-dim">{t("description")}</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/register?role=teacher">
            <Button>
              <GraduationCap size={18} /> {t("ctaTeacher")}
            </Button>
          </Link>
          <Link href="/auth/register?role=student">
            <Button variant="outline" className="group">
              {t("ctaStudent")}{" "}
              <ArrowLeft
                size={18}
                className="transition-transform group-hover:-translate-x-1 ltr:rotate-180 ltr:group-hover:translate-x-1"
              />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
