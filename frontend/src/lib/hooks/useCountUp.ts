"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, shouldStart: boolean, duration = 1400) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setValue(target);
      return;
    }
    let raf: number;
    let start: number | null = null;
    function frame(t: number) {
      if (start === null) start = t;
      const progress = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [shouldStart, target, duration]);

  return value;
}
