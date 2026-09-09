const THEME_INIT = `
(function () {
  try {
    var saved = localStorage.getItem("marahil-theme");
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  } catch (e) {}
})();
`;

/** Runs before paint so a saved theme choice applies with no flash. */
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />;
}
