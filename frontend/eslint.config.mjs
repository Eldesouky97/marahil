import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // These hooks intentionally kick off a cancellable fetch on mount
    // (setLoading(true) then an async call guarded by a `cancelled` flag).
    // That's a correct, common pattern — the newer set-state-in-effect rule
    // just wants callers to migrate to a data-fetching library instead.
    files: ["src/lib/hooks/**/*.ts", "src/context/**/*.tsx"],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
