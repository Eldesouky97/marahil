"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/theme/LanguageSwitcher";
import { useAuth } from "@/context/AuthProvider";
import { logoutUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile, loading } = useAuth();
  const t = useTranslations("nav");
  const dashboardHref = profile ? `/dashboard/${profile.role}` : "/dashboard/student";

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
        <div className="flex flex-col gap-4 border-t border-border bg-bg px-5 py-4 md:hidden">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher />
          {profile ? (
            <Link href={dashboardHref} className="text-sm text-primary-strong" onClick={() => setOpen(false)}>
              {t("dashboard")}
            </Link>
          ) : (
            <Link href="/auth/register" onClick={() => setOpen(false)}>
              <Button className="w-fit px-5 py-2 text-sm">{t("startNow")}</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
