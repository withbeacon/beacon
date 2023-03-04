// @ts-check
import { env } from "./src/env/server.mjs";

// @typedef {import('next').NextConfig} NextConfig
export default {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "@beacon/db",
    "@beacon/ui",
    "@beacon/auth",
    "@beacon/basics",
  ],
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [
      "prisma",
      "@prisma/client",
      "postcss",
      "tailwindcss",
      "autoprefixer",
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: "/favicon/:path*",
        destination: "https://icon.horse/icon/:path*",
      }
    ]
  }
};
