"use client";

import { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
  accent: boolean;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.trim().replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes: Node[] = [];
    let rafId: number | null = null;
    let lineRgb: [number, number, number] = [147, 160, 190];
    let dimRgb: [number, number, number] = [226, 230, 245];
    let accentRgb: [number, number, number] = [212, 169, 79];

    function readThemeColors() {
      const styles = getComputedStyle(root);
      lineRgb = hexToRgb(styles.getPropertyValue("--faint") || "#7b8598");
      dimRgb = hexToRgb(styles.getPropertyValue("--muted") || "#e2e6f5");
      accentRgb = hexToRgb(styles.getPropertyValue("--primary") || "#d4a94f");
    }

    function initNodes() {
      const count = width < 640 ? 24 : width < 1024 ? 36 : 50;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.3 + 0.8,
        phase: Math.random() * Math.PI * 2,
        accent: Math.random() < 0.16,
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
            ctx!.strokeStyle = `rgba(${lineRgb.join(",")},${0.22 * (1 - dist / maxDist)})`;
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
        const rgb = n.accent ? accentRgb : dimRgb;
        const alpha = n.accent ? 0.55 + twinkle * 0.45 : 0.4 + twinkle * 0.4;
        ctx!.fillStyle = `rgba(${rgb.join(",")},${alpha})`;
        ctx!.fill();
      }
      if (!prefersReduced) rafId = requestAnimationFrame(draw);
    }

    readThemeColors();
    resize();
    window.addEventListener("resize", resize);

    const themeObserver = new MutationObserver(() => {
      readThemeColors();
      if (prefersReduced) draw(0);
    });
    themeObserver.observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    if (prefersReduced) draw(0);
    else rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      themeObserver.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />;
}
