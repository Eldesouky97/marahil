"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/theme/LanguageSwitcher";
import { useAuth } from "@/context/AuthProvider";
import { logoutUser } from "@/lib/firebase/auth";
import { isAccountDisabled, isPendingTeacher } from "@/lib/utils/userStatus";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile, loading } = useAuth();
  const t = useTranslations("nav");
  const dashboardHref = !profile
    ? "/dashboard/student"
    : isAccountDisabled(profile)
      ? "/auth/account-disabled"
      : isPendingTeacher(profile)
        ? "/auth/pending-approval"
        : `/dashboard/${profile.role}`;

  const navLinks = [
    { href: "/#stages", label: t("stages") },
    { href: "/courses", label: t("courses") },
    { href: "/#how", label: t("how") },
    { href: "/verify", label: t("verify") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center">
          <Logo size={48} />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-primary-strong">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <ThemeToggle />
          {!loading && profile ? (
            <>
              <Link href={dashboardHref} className="text-sm text-body hover:text-primary-strong">
                {t("dashboard")}
              </Link>
              <Link href="/profile" aria-label={t("profile")} className="text-dim hover:text-primary-strong">
                {profile.photoURL ? (
                  <Image
                    src={profile.photoURL}
                    alt=""
                    width={28}
                    height={28}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <User size={20} />
                )}
              </Link>
              <Button variant="outline" onClick={() => logoutUser()} className="px-5 py-2 text-sm">
                {t("logout")}
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-body hover:text-primary-strong">
                {t("login")}
              </Link>
              <Link href="/auth/register">
                <Button className="px-5 py-2 text-sm">{t("startNow")}</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button className="text-heading" onClick={() => setOpen(!open)} aria-label={t("menu")}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-bg px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-surface-2 hover:text-body"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="my-3 flex items-center justify-between border-t border-border px-3 pt-3">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>

          <div className="border-t border-border pt-3">
            {profile ? (
              <nav className="flex flex-col gap-1">
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-primary-strong transition-colors hover:bg-surface-2"
                >
                  <LayoutDashboard size={18} />
                  {t("dashboard")}
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-body transition-colors hover:bg-surface-2"
                >
                  <User size={18} />
                  {t("profile")}
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    logoutUser();
                  }}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger-ink transition-colors hover:bg-danger/10"
                >
                  <LogOut size={18} />
                  {t("logout")}
                </button>
              </nav>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/auth/login"
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-body transition-colors hover:bg-surface-2"
                >
                  {t("login")}
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)}>
                  <Button className="w-full px-5 py-2.5 text-sm">{t("startNow")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
