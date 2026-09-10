"use client";

import { useEffect, useRef } from "react";
import { Chart, type ChartConfiguration } from "chart.js/auto";

/**
 * Dumb canvas wrapper — callers build the full Chart.js config themselves
 * (including theme-aware colors, see lib/utils/chartColors.ts) and pass a
 * `key` that changes when the theme or underlying data changes, so React
 * remounts this component and the effect below re-creates the chart from
 * scratch instead of trying to diff a config that may contain callbacks.
 */
export function AdminChart({ config }: { config: ChartConfiguration }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const chart = new Chart(canvasRef.current, config);
    return () => chart.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only by design, see comment above
  }, []);

  return <canvas ref={canvasRef} />;
}
