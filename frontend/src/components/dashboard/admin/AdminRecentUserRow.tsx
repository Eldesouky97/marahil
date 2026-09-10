"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type { AppUser } from "@/types/user";

export function AdminRecentUserRow({ user }: { user: AppUser }) {
  const t = useTranslations("dashboardAdmin.users");

  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-dim" dir="ltr">
          {user.email}
        </p>
      </div>
      <Badge className="shrink-0">{t(`role_${user.role}`)}</Badge>
    </div>
  );
}
