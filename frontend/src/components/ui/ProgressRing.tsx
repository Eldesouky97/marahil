"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

/** Caller must wrap this in a `relative` container for `label` to center correctly. */
export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  label,
  className,
}: {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: React.ReactNode;
  className?: string;
}) {
  const gradientId = useId();
  const clamped = Math.min(100, Math.max(0, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("-rotate-90", className)}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--accent)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-overlay" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={`url(#${gradientId})`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      {label && <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{label}</div>}
    </>
  );
}
