import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import { VerifyForm } from "@/components/certificates/VerifyForm";
import { Container } from "@/components/ui/Container";

export default async function VerifyPage() {
  const t = await getTranslations("verify");
  return (
    <section className="py-20">
      <Container size="lg" className="text-center">
        <ShieldCheck size={36} className="mx-auto mb-5 text-accent" />
        <h1 className="mb-3 font-display text-2xl text-heading">{t("title")}</h1>
        <p className="mb-10 text-dim">{t("description")}</p>
        <VerifyForm />
      </Container>
    </section>
  );
}
