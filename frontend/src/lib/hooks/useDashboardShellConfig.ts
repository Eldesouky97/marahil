"use client";

import { useTranslations } from "next-intl";
import { Award, BookOpen, History, LayoutDashboard, Plus, ShieldCheck, SlidersHorizontal, Users } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import type { DashboardNavItem } from "@/components/dashboard/DashboardSidebar";

interface DashboardShellConfig {
  navItems: DashboardNavItem[];
  roleLabel: string;
}

/**
 * The per-role sidebar/topbar config, previously duplicated inline in each
 * dashboard/{admin,teacher,student}/layout.tsx. Now also consumed by
 * SiteChrome so the same shell can wrap every route a signed-in user visits
 * (not just /dashboard/*) without those layouts rendering it a second time.
 * "Site home" and "profile" aren't in these lists — DashboardSidebar.tsx
 * renders both itself (top and bottom respectively) for every role.
 */
export function useDashboardShellConfig(): DashboardShellConfig | null {
  const { profile } = useAuth();
  const tNav = useTranslations("nav");
  const tUsers = useTranslations("dashboardAdmin.users");
  const tAdminSidebar = useTranslations("dashboardAdmin.sidebar");
  const tTeacher = useTranslations("dashboardTeacher");

  if (!profile) return null;

  if (profile.role === "admin") {
    return {
      navItems: [
        { href: "/dashboard/admin", icon: LayoutDashboard, label: tNav("dashboard") },
        { href: "/dashboard/admin/users", icon: Users, label: tAdminSidebar("users") },
        { href: "/dashboard/admin/courses", icon: BookOpen, label: tAdminSidebar("courses") },
        { href: "/dashboard/admin/certificates", icon: Award, label: tAdminSidebar("certificates") },
        { href: "/dashboard/admin/stages", icon: SlidersHorizontal, label: tAdminSidebar("stages") },
        { href: "/dashboard/admin/audit-log", icon: History, label: tAdminSidebar("auditLog") },
      ],
      roleLabel: tUsers("role_admin"),
    };
  }

  if (profile.role === "teacher") {
    return {
      navItems: [
        { href: "/dashboard/teacher", icon: LayoutDashboard, label: tNav("dashboard") },
        { href: "/dashboard/teacher/courses/new", icon: Plus, label: tTeacher("newCourse") },
        { href: "/courses", icon: BookOpen, label: tNav("courses") },
      ],
      roleLabel: tUsers("role_teacher"),
    };
  }

  return {
    navItems: [
      { href: "/dashboard/student", icon: LayoutDashboard, label: tNav("dashboard") },
      { href: "/courses", icon: BookOpen, label: tNav("courses") },
      { href: "/verify", icon: ShieldCheck, label: tNav("verify") },
    ],
    roleLabel: tUsers("role_student"),
  };
}
