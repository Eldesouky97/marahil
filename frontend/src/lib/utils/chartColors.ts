/**
 * Chart.js needs literal color strings, not CSS var() — same constraint as
 * useQrCode.ts (see CLAUDE.md). Reading getComputedStyle at render time keeps
 * a single source of truth (globals.css's chart-1/chart-2/chart-3/border/dim
 * tokens) instead of duplicating hex literals here per theme.
 */
export function getChartColors() {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    series: [read("--chart-1"), read("--chart-2"), read("--chart-3")],
    grid: read("--border"),
    text: read("--dim"),
  };
}
