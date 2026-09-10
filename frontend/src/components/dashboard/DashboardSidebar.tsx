"use client";

import type { LucideIcon } from "lucide-react";
import { LogOut, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/navigation";
import { Logo } from "@/components/layout/Logo";
import { logoutUser } from "@/lib/firebase/auth";
import { cn } from "@/lib/utils/cn";

export interface DashboardNavItem {
  href: string;
  icon: LucideIcon;
  label: string;
}

/**
 * The one sidebar every signed-in role gets under /dashboard — same shell,
 * different `navItems` per role (see each role's layout.tsx). Fixed rail on
 * desktop, off-canvas drawer below `md` (logical `start-0`/translate classes
 * so it flips side automatically between the `ar` and `en` locales).
 */
export function DashboardSidebar({
  navItems,
  homeHref,
  logoutLabel,
  open,
  onClose,
}: {
  navItems: DashboardNavItem[];
  homeHref: string;
  logoutLabel: string;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

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
          <Link href={homeHref} className="flex items-center gap-2">
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
            <span>{logoutLabel}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
