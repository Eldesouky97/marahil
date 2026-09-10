"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/i18n/navigation";
import { DashboardSidebar, type DashboardNavItem } from "./DashboardSidebar";
import { DashboardTopbar, type DashboardTopbarSearch } from "./DashboardTopbar";

/**
 * The single post-login app shell — one sidebar + topbar for every route a
 * signed-in user visits (see SiteChrome.tsx), not the public site's Navbar
 * stacked on top of a second, role-specific one.
 */
export function DashboardShell({
  navItems,
  homeHref,
  roleLabel,
  search,
  children,
}: {
  navItems: DashboardNavItem[];
  homeHref: string;
  roleLabel: string;
  search?: DashboardTopbarSearch;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg">
      <DashboardSidebar
        navItems={navItems}
        homeHref={homeHref}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="ms-0 md:ms-64">
        <DashboardTopbar onMenuClick={() => setSidebarOpen(true)} roleLabel={roleLabel} search={search} />
        <main className="p-5 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
