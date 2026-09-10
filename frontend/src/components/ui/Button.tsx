"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline" | "ghost";

// framer-motion's gesture-handler props (onDrag, onAnimationStart, ...) collide in type with
// the native DOM event handlers of the same name — drop the native ones, motion.button supplies its own.
type NativeEventProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, NativeEventProps> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-gradient-to-l from-primary to-primary-strong text-primary-ink hover:shadow-[0_0_28px_color-mix(in_srgb,var(--primary)_45%,transparent)]",
  outline: "border border-border-strong text-body hover:border-accent/60 hover:text-accent bg-transparent",
  ghost: "text-body hover:text-primary-strong bg-transparent",
};

export function Button({ variant = "primary", className, children, disabled, ...props }: ButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.15 }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-bold transition-[color,background-color,border-color,box-shadow] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
