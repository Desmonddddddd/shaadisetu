import type { NextConfig } from "next";

const securityHeaders = [
  // Stop legacy MIME-type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Limit referrer leakage
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful APIs we never use
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Block clickjacking. Using frame-ancestors via CSP would also work, but
  // X-Frame-Options has wider legacy support and we don't need iframes.
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
