"use client";

import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";

const TONE_CLASSES = {
  primary: "border-e-primary bg-primary/10 text-primary",
  accent: "border-e-accent bg-accent/10 text-accent",
  gold: "border-e-gold bg-gold/10 text-gold-strong",
  success: "border-e-success bg-success/10 text-success",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  tone = "accent",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  tone?: keyof typeof TONE_CLASSES;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn("rounded-xl border border-border bg-surface p-4 border-e-4", TONE_CLASSES[tone])}
    >
      <span className={cn("mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg", TONE_CLASSES[tone])}>
        <Icon size={16} />
      </span>
      <div className="text-lg font-bold text-heading">{value}</div>
      <div className="mt-0.5 text-xs text-dim">{label}</div>
    </motion.div>
  );
}
