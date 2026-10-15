import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/**" },
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/**" },
      { protocol: "https", hostname: "nusadhipa.shop", pathname: "/**" },
      { protocol: "https", hostname: "www.nusadhipa.shop", pathname: "/**" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob: http://127.0.0.1:4000 http://localhost:4000 https://nusadhipa.shop",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self' http://127.0.0.1:4000 http://localhost:4000 ws://localhost:3004 ws://127.0.0.1:3004",
              "frame-src 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;