import { Award, BarChart3, ClipboardCheck, ListChecks, MessageSquare, Video } from "lucide-react";
import { FeatureCard } from "./FeatureCard";
import { Container } from "@/components/ui/Container";

const FEATURES = [
  { icon: Video, title: "دروس بالفيديو والملفات", desc: "ارفع دروسك كفيديو أو PDF، ونظّمها في وحدات وفصول." },
  { icon: ListChecks, title: "مناهج متكاملة", desc: "ابنِ منهجًا كاملًا بترتيب واضح، من الدرس الأول حتى آخر وحدة." },
  { icon: ClipboardCheck, title: "بنك أسئلة واختبارات", desc: "أسئلة اختيار من متعدد، وتصحيح تلقائي فوري." },
  { icon: Award, title: "شهادات رقمية موثقة", desc: "شهادة لكل طالب برمز تحقق فريد يمكن لأي جهة التأكد منه." },
  { icon: BarChart3, title: "تحليلات لحظية", desc: "تتبّع تقدّم كل طالب، ونسب الإتمام، ومتوسط الدرجات." },
  { icon: MessageSquare, title: "تواصل مباشر", desc: "أسئلة الطلاب تصل للمعلم مباشرة." },
];

export function FeaturesSection() {
  return (
    <section id="teachers" className="border-b border-white/[0.06] bg-[#0B1224] py-24">
      <Container>
        <div className="mb-14 max-w-xl">
          <p className="mb-3 text-sm font-bold text-[#3FBFAE]">لوحة المعلّم</p>
          <h2 className="mb-4 font-display text-3xl text-[#F6EFDD]">كل ما يحتاجه المعلّم في مكان واحد</h2>
          <p className="leading-relaxed text-[#8A93A6]">من أول درس تنشره إلى آخر شهادة تصدرها، بأدوات مصمّمة لتوفير وقتك.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </Container>
    </section>
  );
}
