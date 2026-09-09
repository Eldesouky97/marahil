import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // Project guidance lives in the root CLAUDE.md — don't auto-generate a
  // second, conflicting copy here on every `next dev`.
  agentRules: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-7f17e10b1275447f8bb66d7a0e1bd344.r2.dev",
      },
      {
        // Google sign-in profile photos (AppUser.photoURL can come from Google, not just our own upload)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
