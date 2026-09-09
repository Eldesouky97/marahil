import Link from "next/link";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function FinalCta() {
  return (
    <section
      className="py-24"
      style={{ background: "radial-gradient(ellipse at 50% 100%, #1D2C4F 0%, #0B1224 60%)" }}
    >
      <Container size="lg" className="text-center">
        <h2 className="mb-5 font-display text-3xl text-[#F6EFDD]">ابدأ في بناء صفّك الرقمي اليوم</h2>
        <p className="mb-9 leading-relaxed text-[#8A93A6]">بلا تكاليف إعداد، وبلا تعقيد. انشر أول درس خلال دقائق.</p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/register?role=teacher">
            <Button>
              <GraduationCap size={18} /> ابدأ كمعلم
            </Button>
          </Link>
          <Link href="/auth/register?role=student">
            <Button variant="outline" className="group">
              انضم كطالب <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
