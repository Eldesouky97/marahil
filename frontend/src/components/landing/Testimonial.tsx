import { Star } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function Testimonial() {
  return (
    <section className="border-b border-white/[0.06] bg-[#0B1224] py-24">
      <Container size="lg" className="text-center">
        <div className="mb-6 flex justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={16} className="fill-[#D4A94F] text-[#D4A94F]" />
          ))}
        </div>
        <p className="mb-8 font-display text-2xl leading-loose text-[#F0F2FA]">
          &ldquo;نقلت كل مادتي الدراسية إلى مراحل خلال أسبوع واحد. الطلاب أصبحوا يسألون متى الدرس
          القادم، بدل أن أطاردهم أنا.&rdquo;
        </p>
        <p className="font-bold">أ. سارة يوسف</p>
        <p className="text-sm text-[#8A93A6]">معلمة رياضيات، المرحلة الثانوية</p>
      </Container>
    </section>
  );
}
