"use client";

import Link from "next/link";
import { ArrowLeft, PlayCircle, Sparkles } from "lucide-react";
import { Constellation } from "./Constellation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden border-b border-white/[0.06]"
      style={{
        background:
          "radial-gradient(ellipse at 50% -10%, #1D2C4F 0%, #0B1224 55%, #080D1A 100%)",
      }}
    >
      <Constellation />

      <Container className="relative py-24 text-center sm:py-28" size="lg">
        <Badge className="mb-8">
          <Sparkles size={14} /> منصة مراحل التعليمية
        </Badge>

        <h1 className="mb-6 font-display text-4xl leading-snug text-[#F6EFDD] sm:text-5xl">
          دروسك الخصوصية وكورساتك... في مكان واحد
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-lg leading-loose text-[#B9C2DC]">
          يبني المعلمون دروسهم واختباراتهم وشهاداتهم بسهولة، لكل المراحل الدراسية وكل مادة، ويتعلم
          الطلاب بتفاعل فوري خطوة بخطوة حتى الشهادة.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/auth/register?role=teacher">
            <Button className="group">
              ابدأ كمعلم
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
          <Link href="/courses">
            <Button variant="outline">
              <PlayCircle size={18} /> استكشف كطالب
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
