
import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "nusadhipa.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.nusadhipa.shop",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.nusadhipa.shop",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    const scriptSources = [
      "'self'",
      "'unsafe-inline'",
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ];

    const connectSources = [
      "'self'",
      "http://127.0.0.1:4000",
      "http://localhost:4000",
      "https://api.nusadhipa.shop",
      "wss://api.nusadhipa.shop",
      "https://nusadhipa.shop",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://analytics.google.com",
      "https://www.google.com",
      "https://region1.google-analytics.com",
      "https://stats.g.doubleclick.net",
      ...(isDevelopment
        ? ["ws://localhost:3004", "ws://127.0.0.1:3004"]
        : []),
    ];

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              [
                "img-src 'self' data: blob:",
                "http://127.0.0.1:4000",
                "http://localhost:4000",
                "https://nusadhipa.shop",
                "https://www.nusadhipa.shop",
                "https://api.nusadhipa.shop",
                "https://www.google-analytics.com",
                "https://www.google.co.id",
                "https://stats.g.doubleclick.net",
              ].join(" "),
              `script-src ${scriptSources.join(" ")}`,
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              `connect-src ${connectSources.join(" ")}`,
              "frame-src 'self' https://www.googletagmanager.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
