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

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) router.replace("/auth/login");
    else if (!profile) router.replace("/auth/complete-profile");
    else if (disabled) router.replace("/auth/account-disabled");
    else if (profile.role !== role) router.replace(`/dashboard/${profile.role}`);
    else if (pending) router.replace("/auth/pending-approval");
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
