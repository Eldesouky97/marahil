"use client";

import { useTranslations } from "next-intl";
import {
  Award,
  BookOpen,
  History,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { logoutUser } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils/cn";

export function AdminSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const t = useTranslations("dashboardAdmin.sidebar");

  const navItems = [
    { href: "/dashboard/admin", icon: LayoutDashboard, label: t("overview") },
    { href: "/dashboard/admin/users", icon: Users, label: t("users") },
    { href: "/dashboard/admin/courses", icon: BookOpen, label: t("courses") },
    { href: "/dashboard/admin/certificates", icon: Award, label: t("certificates") },
    { href: "/dashboard/admin/stages", icon: SlidersHorizontal, label: t("stages") },
    { href: "/dashboard/admin/audit-log", icon: History, label: t("auditLog") },
  ];

  return (
    <>
      {open && (
        <button
          aria-label="close"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 flex w-64 flex-col bg-gradient-to-b from-primary-strong to-primary text-white transition-transform duration-300",
          open ? "translate-x-0" : "max-md:ltr:-translate-x-full max-md:rtl:translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-6">
          <Link href="/dashboard/admin" className="flex items-center gap-2">
            <Logo size={36} />
          </Link>
          <button onClick={onClose} className="text-white/70 hover:text-white md:hidden" aria-label="close">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/80 transition-colors",
                  active
                    ? "bg-gradient-to-l from-accent to-accent-strong text-accent-ink shadow-[0_4px_15px_rgba(0,0,0,0.25)]"
                    : "hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => logoutUser()}
            className="flex w-full cursor-pointer items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-danger/20 hover:text-white"
          >
            <LogOut size={18} />
            <span>{t("logout")}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
