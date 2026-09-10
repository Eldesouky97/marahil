"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const VARIANT_CLASSES = {
  default: "border-border text-dim hover:text-heading",
  /** For placement on DashboardSidebar's dark navy gradient — the default variant's tokens are calibrated for a light surface and read poorly there. */
  sidebar: "border-white/20 text-white/70 hover:bg-white/10 hover:text-white",
} as const;

export function LanguageSwitcher({ variant = "default" }: { variant?: keyof typeof VARIANT_CLASSES }) {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className={cn("flex h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", VARIANT_CLASSES[variant])}
    >
      <Languages size={14} />
      {t("language")}
    </Link>
  );
}
