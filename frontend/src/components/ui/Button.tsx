import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "gold" | "outline" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  gold: "bg-gradient-to-l from-[#D4A94F] to-[#E8C878] text-[#241A05] hover:shadow-[0_0_28px_rgba(212,169,79,0.45)]",
  outline: "border border-white/15 text-[#E7E9F2] hover:border-teal-400/60 hover:text-[#3FBFAE] bg-transparent",
  ghost: "text-[#E7E9F2] hover:text-[#E8C878] bg-transparent",
};

export function Button({ variant = "gold", className, children, ...props }: ButtonProps) {
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
