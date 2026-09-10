import * as XLSX from "xlsx";

/**
 * Client-side .xlsx export via SheetJS — write-only (builds a workbook from
 * our own trusted data and triggers a download), never used to parse a
 * user-supplied file. That distinction matters: the published `xlsx` npm
 * package has open prototype-pollution/ReDoS advisories with no fix
 * available, but both are in the *parser* for untrusted input, which this
 * call path never exercises.
 */
export function downloadExcel(filename: string, headers: string[], rows: (string | number)[][], sheetName = "Sheet1"): void {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  worksheet["!cols"] = headers.map((h, i) => {
    const longest = Math.max(h.length, ...rows.map((r) => String(r[i] ?? "").length));
    return { wch: Math.min(Math.max(longest + 2, 10), 40) };
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}
