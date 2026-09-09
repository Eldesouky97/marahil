"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("common");
  const nextLocale = locale === "ar" ? "en" : "ar";

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="flex h-9 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-dim transition-colors hover:text-heading"
    >
      <Languages size={14} />
      {t("language")}
    </Link>
  );
}
