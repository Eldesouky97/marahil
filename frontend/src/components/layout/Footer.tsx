"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";

const PLATFORM_LINKS = [
  { key: "stages", href: "/#stages" },
  { key: "courses", href: "/courses" },
  { key: "how", href: "/#how" },
  { key: "verify", href: "/verify" },
] as const;

const ACCOUNT_LINKS = [
  { key: "login", href: "/auth/login" },
  { key: "register", href: "/auth/register" },
] as const;

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-bg-alt py-14">
      <Container>
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo size={56} />
            <p className="mt-3 max-w-xs text-sm text-dim">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-heading">{t("columns.platform.title")}</h3>
            <ul className="space-y-2">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-dim transition-colors hover:text-primary-strong">
                    {t(`columns.platform.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold text-heading">{t("columns.account.title")}</h3>
            <ul className="space-y-2">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.key}>
                  <Link href={link.href} className="text-sm text-dim transition-colors hover:text-primary-strong">
                    {t(`columns.account.links.${link.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center">
          <p className="text-xs text-faint">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </Container>
    </footer>
  );
}
