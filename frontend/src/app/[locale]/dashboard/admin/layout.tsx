"use client";

import { useTranslations } from "next-intl";
import { Award, BookOpen, History, LayoutDashboard, SlidersHorizontal, Users } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useTranslations("dashboardAdmin.sidebar");
  const tTopbar = useTranslations("dashboardAdmin.topbar");
  const tUsers = useTranslations("dashboardAdmin.users");
  const tNav = useTranslations("nav");

  const navItems = [
    { href: "/dashboard/admin", icon: LayoutDashboard, label: tNav("dashboard") },
    { href: "/dashboard/admin/users", icon: Users, label: t("users") },
    { href: "/dashboard/admin/courses", icon: BookOpen, label: t("courses") },
    { href: "/dashboard/admin/certificates", icon: Award, label: t("certificates") },
    { href: "/dashboard/admin/stages", icon: SlidersHorizontal, label: t("stages") },
    { href: "/dashboard/admin/audit-log", icon: History, label: t("auditLog") },
  ];

  return (
    <RoleGuard role="admin">
      <DashboardShell
        navItems={navItems}
        homeHref="/dashboard/admin"
        roleLabel={tUsers("role_admin")}
        search={{
          placeholder: tTopbar("searchPlaceholder"),
          onSubmit: (query) =>
            router.push(query ? `/dashboard/admin/users?q=${encodeURIComponent(query)}` : "/dashboard/admin/users"),
        }}
      >
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
