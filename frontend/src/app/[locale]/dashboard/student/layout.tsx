"use client";

import { useTranslations } from "next-intl";
import { BookOpen, LayoutDashboard, ShieldCheck, User } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const tUsers = useTranslations("dashboardAdmin.users");

  const navItems = [
    { href: "/dashboard/student", icon: LayoutDashboard, label: t("dashboard") },
    { href: "/courses", icon: BookOpen, label: t("courses") },
    { href: "/verify", icon: ShieldCheck, label: t("verify") },
    { href: "/profile", icon: User, label: t("profile") },
  ];

  return (
    <RoleGuard role="student">
      <DashboardShell navItems={navItems} homeHref="/dashboard/student" roleLabel={tUsers("role_student")}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
