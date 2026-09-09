"use client";

import { useCountUp } from "@/lib/hooks/useCountUp";

export function StatItem({
  target,
  suffix,
  label,
  shouldStart,
}: {
  target: number;
  suffix: string;
  label: string;
  shouldStart: boolean;
}) {
  const value = useCountUp(target, shouldStart);
  return (
    <div className="text-center">
      <div className="mb-2 font-display text-3xl text-primary">
        {value.toLocaleString("en-US")}
        {suffix}
      </div>
      <div className="text-sm text-dim">{label}</div>
    </div>
  );
}
