const BOM = "﻿";

function escapeCsvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

/** Triggers a browser download of `rows` as a CSV file — UTF-8 BOM so Arabic text renders correctly in Excel. */
export function downloadCsv(filename: string, headers: string[], rows: (string | number)[][]): void {
  const lines = [headers, ...rows].map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(","));
  const blob = new Blob([BOM + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
