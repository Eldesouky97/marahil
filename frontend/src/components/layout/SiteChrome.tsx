"use client";

import { usePathname } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useDashboardShellConfig } from "@/lib/hooks/useDashboardShellConfig";
import { isAccountDisabled, isPendingTeacher } from "@/lib/utils/userStatus";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { LenisProvider } from "./LenisProvider";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

const EXEMPT_PREFIXES = ["/auth"];

/**
 * The single post-login nav for the signed-in app — a signed-in user with a
 * complete, approved, enabled profile gets DashboardShell (sidebar +
 * topbar) on *every* route, including the bare home page `/`, except
 * `/auth/*` (kept plain; mid sign-up isn't "in the app" yet). `/` used to be
 * exempt too — the sidebar's own "site home" link stacked the app shell's
 * topbar back on top of the marketing Hero, which looked broken — but the
 * fix now is deliberately the opposite: the sidebar *is* the one nav for
 * the whole site once signed in, home page included, rather than switching
 * chrome per-route. Anonymous visitors, and anyone still mid-auth-
 * resolution, get the normal public Navbar/Footer — matching Navbar's own
 * existing default-to-signed-out rendering while `loading`. Lenis
 * smooth-scroll wraps only that public branch (see LenisProvider.tsx for
 * why it's kept out of the dashboard).
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
    !EXEMPT_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (showAppShell && shellConfig) {
    return <DashboardShell {...shellConfig}>{children}</DashboardShell>;
  }

  return (
    <LenisProvider>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </LenisProvider>
  );
}
