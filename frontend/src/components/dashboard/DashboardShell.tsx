"use client";

import { useState } from "react";
import { DashboardSidebar, type DashboardNavItem } from "./DashboardSidebar";
import { DashboardTopbar, type DashboardTopbarSearch } from "./DashboardTopbar";

/**
 * The single post-login app shell for every role under /dashboard — one
 * sidebar + topbar, not the public site's Navbar stacked on top of a
 * second, role-specific one. SiteChrome hides Navbar/Footer for any
 * /dashboard/* route so this is the only nav chrome visible there.
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
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
