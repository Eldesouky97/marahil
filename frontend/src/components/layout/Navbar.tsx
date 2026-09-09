"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "./NavLinks";
import { useAuth } from "@/context/AuthProvider";
import { logoutUser } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile, loading } = useAuth();
  const dashboardHref = profile?.role === "teacher" ? "/dashboard/teacher" : "/dashboard/student";

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0B1224]/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-display text-xl text-[#F6EFDD]">مراحل</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[#C7CEE3] transition-colors hover:text-[#E8C878]">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!loading && profile ? (
            <>
              <Link href={dashboardHref} className="text-sm text-[#E7E9F2] hover:text-[#E8C878]">
                لوحة التحكم
              </Link>
              <Button variant="outline" onClick={() => logoutUser()} className="px-5 py-2 text-sm">
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-sm text-[#E7E9F2] hover:text-[#E8C878]">
                تسجيل الدخول
              </Link>
              <Link href="/auth/register">
                <Button className="px-5 py-2 text-sm">ابدأ الآن</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="text-[#F6EFDD] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="القائمة"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-4 border-t border-white/[0.06] bg-[#0B1224] px-5 py-4 md:hidden">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[#C7CEE3]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          {profile ? (
            <Link href={dashboardHref} className="text-sm text-[#E8C878]" onClick={() => setOpen(false)}>
              لوحة التحكم
            </Link>
          ) : (
            <Link href="/auth/register" onClick={() => setOpen(false)}>
              <Button className="w-fit px-5 py-2 text-sm">ابدأ الآن</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
