"use client";

import { User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthProvider";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

/**
 * No search box here — it was only ever admin's, and duplicated the one
 * already on the users page itself (AdminUsersView), so it's gone. No
 * separate hamburger button either: the profile chip itself opens the
 * sidebar on mobile (tapping it on desktop is a no-op, since the sidebar
 * there is always visible regardless of the open/close state).
 */
export function DashboardTopbar({ onMenuClick, roleLabel }: { onMenuClick: () => void; roleLabel: string }) {
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-5 py-3">
      <Logo size={32} />

      <div className="ms-auto flex items-center gap-3">
        <ThemeToggle />
        {profile && (
          <button
            onClick={onMenuClick}
            aria-label="menu"
            className="flex cursor-pointer items-center gap-2 rounded-full bg-bg py-1.5 ps-1.5 pe-3 transition-colors hover:bg-surface-2 md:cursor-default md:hover:bg-bg"
          >
            {profile.photoURL ? (
              <Image src={profile.photoURL} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon size={16} />
              </span>
            )}
            <div className="hidden sm:block text-start">
              <p className="text-xs font-bold leading-tight">{profile.name}</p>
              <p className="text-[11px] leading-tight text-dim">{roleLabel}</p>
            </div>
          </button>
        )}
      </div>
    </header>
  );
}
