"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { isAccountDisabled, isPendingTeacher } from "@/lib/utils/userStatus";

const EXEMPT_PREFIX = "/auth";

/**
 * Site-wide gate, mounted once in the root layout above SiteChrome — unlike
 * RoleGuard (scoped to /dashboard/*), this applies to every route. A
 * signed-in user with no completed profile, a still-pending teacher, or a
 * disabled account gets redirected off of anything except /auth/* itself
 * (so the target pages stay reachable) — not just kept out of the
 * dashboard, out of the whole app. RoleGuard still blocks *rendering* on
 * /dashboard/* for these same states (to avoid a content flash before this
 * effect fires) but no longer issues these particular redirects itself, so
 * the two never race each other to different targets.
 */
export function AuthGate({ children }: { children: React.ReactNode }) {
  const { firebaseUser, profile, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loading || !firebaseUser || pathname.startsWith(EXEMPT_PREFIX)) return;
    if (!profile) router.replace("/auth/complete-profile");
    else if (isAccountDisabled(profile)) router.replace("/auth/account-disabled");
    else if (isPendingTeacher(profile)) router.replace("/auth/pending-approval");
  }, [loading, firebaseUser, profile, pathname, router]);

  return <>{children}</>;
}
