"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function RatingStars({
  value,
  size = 16,
  interactive = false,
  onChange,
}: {
  value: number;
  size?: number;
  interactive?: boolean;
  onChange?: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(i)}
          className={cn(!interactive && "cursor-default")}
          aria-label={String(i)}
        >
          <Star
            size={size}
            className={i <= Math.round(value) ? "fill-gold text-gold" : "fill-none text-border"}
          />
        </button>
      ))}
    </div>
  );
}
