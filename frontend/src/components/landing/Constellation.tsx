"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  gold: boolean;
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let rafId: number | null = null;

    function initNodes() {
      const count = width < 640 ? 24 : width < 1024 ? 36 : 50;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.3 + 0.8,
        phase: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.16,
      }));
    }

    function resize() {
      if (!canvas) return;
      const rect = canvas.parentElement!.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      const maxDist = width < 640 ? 85 : 125;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        if (!prefersReduced) {
          a.x += a.vx;
          a.y += a.vy;
          if (a.x < 0 || a.x > width) a.vx *= -1;
          if (a.y < 0 || a.y > height) a.vy *= -1;
        }
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx!.strokeStyle = `rgba(147,160,190,${0.16 * (1 - dist / maxDist)})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.stroke();
          }
        }
      }
      for (const n of nodes) {
        const twinkle = prefersReduced ? 1 : 0.55 + 0.45 * Math.sin(t / 900 + n.phase);
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * (0.8 + twinkle * 0.5), 0, Math.PI * 2);
        ctx!.fillStyle = n.gold
          ? `rgba(212,169,79,${0.55 + twinkle * 0.45})`
          : `rgba(226,230,245,${0.35 + twinkle * 0.4})`;
        ctx!.fill();
      }
      if (!prefersReduced) rafId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    if (prefersReduced) draw(0);
    else rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
