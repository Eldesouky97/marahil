"use client";

import { usePathname } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useDashboardShellConfig } from "@/lib/hooks/useDashboardShellConfig";
import { isAccountDisabled, isPendingTeacher } from "@/lib/utils/userStatus";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const EXEMPT_PREFIX = "/auth";

/**
 * The single post-login nav for the whole site, not just /dashboard/* — a
 * signed-in user with a complete, approved, enabled profile gets the
 * DashboardShell (sidebar + topbar) on every route except /auth/* (kept
 * plain — mid sign-up isn't "in the app" yet), the same shell that used to
 * only wrap /dashboard/* pages from within their own layout.tsx. Those three
 * layouts now only run RoleGuard; rendering the shell here instead avoids
 * wrapping it twice on /dashboard/* itself. Anonymous visitors, and anyone
 * still mid-auth-resolution, get the normal public Navbar/Footer — matching
 * Navbar's own existing default-to-signed-out rendering while `loading`.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { firebaseUser, profile, loading } = useAuth();
  const shellConfig = useDashboardShellConfig();

  const showAppShell =
    !loading &&
    !!firebaseUser &&
    !!profile &&
    !isPendingTeacher(profile) &&
    !isAccountDisabled(profile) &&
    !pathname.startsWith(EXEMPT_PREFIX);

  if (showAppShell && shellConfig) {
    return <DashboardShell {...shellConfig}>{children}</DashboardShell>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
