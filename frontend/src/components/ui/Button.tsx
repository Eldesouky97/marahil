import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-primary to-primary-strong text-primary-ink hover:shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
  outline: "border border-border-strong text-body hover:border-accent/60 hover:text-accent bg-transparent",
  ghost: "text-body hover:text-primary-strong bg-transparent",
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
