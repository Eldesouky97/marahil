"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Eraser, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { LiveStroke } from "@/types/liveSession";

const COLORS = ["#1F2937", "#E4573D", "#2F80ED", "#27AE60", "#FFFFFF"];
const SIZES = [3, 6, 10];

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Pick<LiveStroke, "color" | "size" | "points">, w: number, h: number) {
  if (stroke.points.length < 4) return;
  ctx.strokeStyle = stroke.color;
  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(stroke.points[0] * w, stroke.points[1] * h);
  for (let i = 2; i < stroke.points.length; i += 2) {
    ctx.lineTo(stroke.points[i] * w, stroke.points[i + 1] * h);
  }
  ctx.stroke();
}

export function LiveWhiteboard({
  strokes,
  canDraw,
  onDraw,
  onClear,
}: {
  strokes: LiveStroke[];
  canDraw: boolean;
  onDraw: (color: string, size: number, points: number[]) => void;
  onClear?: () => void;
}) {
  const t = useTranslations("liveSessions");
  const baseRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef<{ points: number[] } | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [size, setSize] = useState(SIZES[0]);

  // Redraw all committed strokes whenever they change.
  useEffect(() => {
    const canvas = baseRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    for (const stroke of strokes) drawStroke(ctx, stroke, width, height);
  }, [strokes]);

  function toNormalized(e: React.PointerEvent<HTMLCanvasElement>): [number, number] {
    const rect = e.currentTarget.getBoundingClientRect();
    return [(e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height];
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canDraw) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drawingRef.current = { points: toNormalized(e) };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!canDraw || !drawingRef.current) return;
    drawingRef.current.points.push(...toNormalized(e));
    const canvas = liveRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStroke(ctx, { color, size, points: drawingRef.current.points }, canvas.width, canvas.height);
  }

  function handlePointerUp() {
    if (!canDraw || !drawingRef.current) return;
    const points = drawingRef.current.points;
    drawingRef.current = null;
    const canvas = liveRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onDraw(color, size, points);
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white">
      <canvas ref={baseRef} width={900} height={480} className="block h-auto w-full" />
      <canvas
        ref={liveRef}
        width={900}
        height={480}
        className={cn("absolute inset-0 h-full w-full", canDraw ? "touch-none" : "pointer-events-none")}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      {canDraw && (
        <div className="absolute bottom-3 flex items-center gap-2 rounded-full border border-border bg-surface/95 px-3 py-2 shadow-md ltr:left-3 rtl:right-3">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-label={c}
              onClick={() => setColor(c)}
              className={cn("h-5 w-5 rounded-full border", color === c ? "ring-2 ring-primary ring-offset-1" : "border-border-strong")}
              style={{ backgroundColor: c }}
            />
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={cn("flex h-6 w-6 items-center justify-center rounded-full", size === s && "bg-overlay")}
              aria-label={String(s)}
            >
              <span className="rounded-full bg-current" style={{ width: s, height: s }} />
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-border" />
          <button type="button" onClick={() => setColor("#FFFFFF")} aria-label={t("eraser")} className="text-dim hover:text-heading">
            <Eraser size={15} />
          </button>
          {onClear && (
            <button type="button" onClick={onClear} aria-label={t("clearBoard")} className="text-danger hover:text-danger-ink">
              <Trash2 size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
