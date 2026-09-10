"use client";

import { usePathname } from "@/i18n/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * /dashboard/* renders its own DashboardShell (sidebar + topbar) — showing
 * the public Navbar/Footer there too used to stack a second nav on top of
 * it (the "2 sidebars" problem: Navbar's own mobile drawer plus the
 * dashboard's). Everywhere else keeps the normal public-site chrome.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const inDashboard = pathname.startsWith("/dashboard");

  if (inDashboard) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
