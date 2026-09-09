"use client";

import { useId } from "react";

/**
 * The mark is a rub el hizb-style eight-point star (two overlapping squares)
 * — a wayfinding/compass-star motif that reads as "the star that lights a
 * student's path" (the platform's own tagline) while nodding to Arabic
 * geometric ornament. Colors come from the live theme tokens, so it recolors
 * correctly across light/dark. See design-reference/brand/ for the full
 * identity documentation this mark belongs to.
 */
export function Logo({ size = 30 }: { size?: number }) {
  const uid = useId().replace(/:/g, "");
  const primaryGrad = `logo-primary-${uid}`;
  const accentGrad = `logo-accent-${uid}`;

  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={accentGrad} x1="9" y1="9" x2="31" y2="31" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-strong)" />
        </linearGradient>
        <linearGradient id={primaryGrad} x1="9" y1="31" x2="31" y2="9" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--primary-strong)" />
        </linearGradient>
      </defs>
      <rect
        x="9"
        y="9"
        width="22"
        height="22"
        rx="2.5"
        fill={`url(#${accentGrad})`}
        opacity="0.92"
        transform="rotate(45 20 20)"
      />
      <rect x="9" y="9" width="22" height="22" rx="2.5" fill={`url(#${primaryGrad})`} opacity="0.92" />
      <circle cx="20" cy="20" r="3" fill="var(--heading)" />
    </svg>
  );
}
