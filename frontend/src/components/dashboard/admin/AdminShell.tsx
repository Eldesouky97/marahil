"use client";

import { useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="ms-0 md:ms-64">
        <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
