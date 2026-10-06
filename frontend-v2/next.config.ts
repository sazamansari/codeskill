import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["@react-pdf/renderer"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });
    
    // Fix monaco-vim attempting to import a strict ESM path that conflicts with monaco-editor's package.json exports
    config.resolve.alias = {
      ...config.resolve.alias,
      "monaco-editor/esm/vs/editor/editor.api": path.resolve(process.cwd(), "node_modules/monaco-editor/esm/vs/editor/editor.api.js"),
    };
    
    return config;
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
