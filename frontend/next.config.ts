import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Project guidance lives in the root CLAUDE.md — don't auto-generate a
  // second, conflicting copy here on every `next dev`.
  agentRules: false,
};

export default withNextIntl(nextConfig);
