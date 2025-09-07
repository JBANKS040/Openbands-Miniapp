import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/.well-known/farcaster.json",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600" },
          { key: "Content-Type", value: "application/json; charset=utf-8" },
        ],
      },
      {
        // Cache common image assets longer for crawlers
        source: "/:path*{.png,.jpg,.jpeg,.gif,.webp}",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
