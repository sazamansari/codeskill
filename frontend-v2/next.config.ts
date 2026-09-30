import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.INTERNAL_BACKEND_URL || "http://127.0.0.1:5001/api/:path*",
      },
    ];
  },
};

export default nextConfig;
