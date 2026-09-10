"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Wraps a list of direct children (a features grid, steps grid, a heading
 * block) and fades/slides each one up as it scrolls into view, once. Built
 * on ScrollTrigger.batch so a grid staggers per-card instead of all firing
 * together. Skipped entirely under prefers-reduced-motion.
 */
export function ScrollReveal({
  children,
  className,
  y = 28,
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const targets = gsap.utils.toArray<HTMLElement>(containerRef.current ? [...containerRef.current.children] : []);
      if (targets.length === 0) return;

      gsap.set(targets, { opacity: 0, y });
      ScrollTrigger.batch(targets, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger, ease: "power2.out" }),
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
