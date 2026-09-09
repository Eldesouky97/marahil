"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  const t = useTranslations("common");
  return (
    <span
      className={cn(
        "inline-block h-5 w-5 animate-spin rounded-full border-2 border-border-strong border-t-primary",
        className
      )}
      role="status"
      aria-label={t("loading")}
    />
  );
}
