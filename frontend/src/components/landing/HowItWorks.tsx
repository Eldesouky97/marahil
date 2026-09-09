import { Award, BookOpen, ClipboardCheck, Video } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/Container";

const STEPS = [
  { n: "١", title: "المعلّم ينشر الدرس", desc: "رفع فيديو أو ملف، وإضافة شرح مكتوب وأسئلة.", icon: Video },
  { n: "٢", title: "الطالب يتعلّم بذكاء", desc: "تتبّع تلقائي للتقدّم، وأسئلة قصيرة أثناء الدرس.", icon: BookOpen },
  { n: "٣", title: "اختبار يقيس الفهم", desc: "أسئلة تُصحَّح فورًا مع تحليل لنقاط القوة والضعف.", icon: ClipboardCheck },
  { n: "٤", title: "شهادة موثّقة تصدر", desc: "شهادة رقمية موقّعة، برمز تحقق فريد لكل طالب.", icon: Award },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-b border-white/[0.06] bg-[#0B1224] py-24">
      <Container>
        <SectionHeading eyebrow="كيف تعمل المنصة" title="من فكرة المعلّم... إلى شهادة الطالب" />

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
          <div className="absolute top-8 right-[12%] left-[12%] hidden border-t-2 border-dashed border-[#D4A94F]/25 md:block" />
          {STEPS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="relative z-10 flex flex-col items-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#D4A94F]/30 bg-[#141F38]">
                  <span className="font-display text-xl text-[#D4A94F]">{s.n}</span>
                </div>
                <Icon size={22} className="mb-3 text-[#3FBFAE]" />
                <h3 className="mb-2 font-bold">{s.title}</h3>
                <p className="max-w-56 text-sm leading-relaxed text-[#8A93A6]">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
