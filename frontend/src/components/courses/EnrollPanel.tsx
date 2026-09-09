"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { useEnrollment } from "@/lib/hooks/useEnrollment";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";

export function EnrollPanel({ courseId }: { courseId: string }) {
  const { profile, loading: authLoading } = useAuth();
  const { enrollment, loading, enroll } = useEnrollment(profile?.uid, courseId);

  if (authLoading || loading) return null;

  if (!profile) {
    return (
      <Link href={`/auth/login`}>
        <Button className="w-full">سجّل الدخول للالتحاق بالدورة</Button>
      </Link>
    );
  }

  if (profile.role === "teacher") {
    return <p className="text-sm text-[#8A93A6]">الالتحاق بالدورات متاح لحسابات الطلاب فقط.</p>;
  }

  if (!enrollment) {
    return (
      <Button className="w-full" onClick={enroll}>
        التحق بالدورة الآن
      </Button>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-[#8A93A6]">تقدّمك في الدورة</span>
        <span className="text-[#E8C878]">{enrollment.progress}%</span>
      </div>
      <ProgressBar value={enrollment.progress} />
    </div>
  );
}
