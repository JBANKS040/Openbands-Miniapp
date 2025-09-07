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
      // Explicit assets used by manifest/embeds
      {
        source: "/hero.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
      {
        source: "/splash.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
      {
        source: "/Openbands.png",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
      {
        // Generic pattern for other images
        source: "/(.*\\.(png|jpg|jpeg|gif|webp))",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
