"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Search, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useAuth } from "@/context/AuthProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function AdminTopbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { profile } = useAuth();
  const t = useTranslations("dashboardAdmin.topbar");
  const tRole = useTranslations("dashboardAdmin.users");
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push(query.trim() ? `/dashboard/admin/users?q=${encodeURIComponent(query.trim())}` : "/dashboard/admin/users");
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-surface px-5 py-3">
      <button onClick={onMenuClick} className="text-heading md:hidden" aria-label="menu">
        <Menu size={22} />
      </button>

      <form onSubmit={handleSubmit} className="relative max-w-md flex-1">
        <Search size={16} className="absolute top-1/2 -translate-y-1/2 text-faint start-4" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full rounded-xl border border-border bg-bg py-2.5 text-sm text-body outline-none ps-10 pe-4 focus:border-accent/50"
        />
      </form>

      <div className="ms-auto flex items-center gap-3">
        <ThemeToggle />
        {profile && (
          <div className="flex items-center gap-2 rounded-full bg-bg py-1.5 ps-1.5 pe-3">
            {profile.photoURL ? (
              <Image src={profile.photoURL} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <UserIcon size={16} />
              </span>
            )}
            <div className="hidden sm:block">
              <p className="text-xs font-bold leading-tight">{profile.name}</p>
              <p className="text-[11px] leading-tight text-dim">{tRole("role_admin")}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
