import type { NextConfig } from "next";
import { CANONICAL_API_URL } from "./src/lib/site/config.ts";

// The API base is configured explicitly, never by an implicit default.
const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
if (!/^https?:\/\/[^/]+\/api$/.test(apiUrl)) {
  throw new Error("NEXT_PUBLIC_API_URL must be set to the API base, e.g. " + CANONICAL_API_URL);
}
if (process.env.VERCEL_ENV === "production" && apiUrl !== CANONICAL_API_URL) {
  throw new Error(`Production builds must use the canonical API ${CANONICAL_API_URL}, not ${apiUrl}`);
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Private quiz links, answer deletion and draft legal pages are never indexed.
        source: "/:dir(quiz|privacy|terms)/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:dir(privacy|terms)",
        headers: [{ key: "X-Robots-Tag", value: "noindex" }],
      },
      {
        // Synced app artwork: content-hashed by the sync manifest, safe to cache.
        source: "/app-content/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
};

export default nextConfig;
