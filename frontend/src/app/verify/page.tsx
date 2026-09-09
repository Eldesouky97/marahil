import { ShieldCheck } from "lucide-react";
import { VerifyForm } from "@/components/certificates/VerifyForm";
import { Container } from "@/components/ui/Container";

export default function VerifyPage() {
  return (
    <section className="py-20">
      <Container size="lg" className="text-center">
        <ShieldCheck size={36} className="mx-auto mb-5 text-[#3FBFAE]" />
        <h1 className="mb-3 font-display text-2xl text-[#F6EFDD]">التحقق من شهادة</h1>
        <p className="mb-10 text-[#8A93A6]">أدخل رمز التحقق الموجود على الشهادة للتأكد من صحتها.</p>
        <VerifyForm />
      </Container>
    </section>
  );
}
