"use client";

import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeProvider";
import { cn } from "@/lib/utils/cn";

const VARIANT_CLASSES = {
  default: "border-border text-dim hover:text-heading",
  /** For placement on DashboardSidebar's dark navy gradient — the default variant's tokens are calibrated for a light surface and read poorly there. */
  sidebar: "border-white/20 text-white/70 hover:bg-white/10 hover:text-white",
} as const;

export function ThemeToggle({ variant = "default" }: { variant?: keyof typeof VARIANT_CLASSES }) {
  const { theme, toggleTheme } = useTheme();
  const t = useTranslations("common");
  return (
    <button
      onClick={toggleTheme}
      aria-label={theme === "dark" ? t("themeToLight") : t("themeToDark")}
      className={cn(
        "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors",
        VARIANT_CLASSES[variant]
      )}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
