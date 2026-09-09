"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import type { UserRole } from "@/types/user";

export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!profile) router.replace("/auth/login");
    else if (profile.role !== role) router.replace(`/dashboard/${profile.role}`);
  }, [loading, profile, role, router]);

  if (loading || !profile || profile.role !== role) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
