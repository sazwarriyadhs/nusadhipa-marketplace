import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async redirects() {
    return [
      {
        source: "/daftar",
        destination: "/register?type=tenant",
        permanent: false,
      },
    ];
  },

  async headers() {
    const scriptSrc = [
      "'self'",
      "'unsafe-inline'",
      isDevelopment ? "'unsafe-eval'" : "",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
    ]
      .filter(Boolean)
      .join(" ");

    const connectSrc = [
      "'self'",
      "http://127.0.0.1:4000",
      "http://localhost:4000",
      "https://nusadhipa.shop",
      "https://www.nusadhipa.shop",
      "https://api.nusadhipa.shop",
      "https://www.google-analytics.com",
      "https://www.googletagmanager.com",
      "https://res.cloudinary.com",
    ]
      .filter(Boolean)
      .join(" ");

    const cspValue = [
      "default-src 'self'",
      "img-src 'self' data: blob: http://127.0.0.1:4000 http://localhost:4000 https://nusadhipa.shop https://www.nusadhipa.shop https://api.nusadhipa.shop https://res.cloudinary.com https://images.unsplash.com https://www.google-analytics.com https://www.google.co.id https://stats.g.doubleclick.net",
      `script-src ${scriptSrc}`,
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      `connect-src ${connectSrc}`,
      "frame-src 'self' https://www.googletagmanager.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: cspValue,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
