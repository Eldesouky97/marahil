"use client";

import { useTranslations } from "next-intl";
import { BookOpen, LayoutDashboard, Plus, User } from "lucide-react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  const tTeacher = useTranslations("dashboardTeacher");
  const tUsers = useTranslations("dashboardAdmin.users");

  const navItems = [
    { href: "/dashboard/teacher", icon: LayoutDashboard, label: t("dashboard") },
    { href: "/dashboard/teacher/courses/new", icon: Plus, label: tTeacher("newCourse") },
    { href: "/courses", icon: BookOpen, label: t("courses") },
    { href: "/profile", icon: User, label: t("profile") },
  ];

  return (
    <RoleGuard role="teacher">
      <DashboardShell navItems={navItems} homeHref="/dashboard/teacher" roleLabel={tUsers("role_teacher")}>
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
