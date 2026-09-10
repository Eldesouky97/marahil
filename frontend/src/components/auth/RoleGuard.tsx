"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Spinner } from "@/components/ui/Spinner";
import { isAccountDisabled, isPendingTeacher } from "@/lib/utils/userStatus";
import type { UserRole } from "@/types/user";

export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { firebaseUser, profile, loading } = useAuth();
  const router = useRouter();
  const disabled = isAccountDisabled(profile);
  const pending = isPendingTeacher(profile);

  // No-profile / disabled / pending are redirected by AuthGate (site-wide,
  // mounted in the root layout) — this effect only owns what's specific to
  // being on a /dashboard/* route: signed-out, and a signed-in wrong role.
  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) router.replace("/auth/login");
    else if (profile && profile.role !== role && !disabled && !pending) router.replace(`/dashboard/${profile.role}`);
  }, [loading, firebaseUser, profile, role, disabled, pending, router]);

  if (loading || !profile || profile.role !== role || pending || disabled) {
    return (
      <div className="flex justify-center py-24">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
}
