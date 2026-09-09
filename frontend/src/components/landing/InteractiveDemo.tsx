import { QuizPlayer } from "@/components/quiz/QuizPlayer";
import { SectionHeading } from "./SectionHeading";
import { Container } from "@/components/ui/Container";

const DEMO_QUESTIONS = [
  { id: "1", question: "ما ناتج ٧ × ٨ ؟", choices: ["54", "64", "56", "58"], correct: 2, explanation: "٧ × ٨ = ٥٦" },
  {
    id: "2",
    question: "ما الغاز الذي تحتاجه خلايا الجسم للتنفس؟",
    choices: ["ثاني أكسيد الكربون", "الأكسجين", "النيتروجين", "الهيدروجين"],
    correct: 1,
    explanation: "الأكسجين هو الغاز الأساسي الذي تستخدمه الخلايا.",
  },
  {
    id: "3",
    question: "ما جمع كلمة «كتاب»؟",
    choices: ["كتب", "كتائب", "كاتبون", "مكاتب"],
    correct: 0,
    explanation: "جمع «كتاب» هو «كُتُب».",
  },
];

export function InteractiveDemo() {
  return (
    <section id="demo" className="border-b border-white/[0.06] bg-[#0B1224] py-24">
      <Container size="lg">
        <SectionHeading
          eyebrow="تجربة حيّة"
          title="جرّب درسًا تفاعليًا الآن"
          description="هكذا يشعر الطالب بالتفاعل الفوري في كل اختبار — إجابة، وتصحيح، وتفسير في نفس اللحظة."
        />
        <div className="rounded-2xl border border-white/10 bg-[#0F1729] p-8">
          <QuizPlayer questions={DEMO_QUESTIONS} />
        </div>
      </Container>
    </section>
  );
}
