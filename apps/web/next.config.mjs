// @ts-check
import { env } from "./src/env/server.mjs";
import withTM from "next-transpile-modules";

export default {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
    transpilePackages: [
      "@bud/api",
      "@bud/db",
      "@bud/ui",
      "@bud/auth",
      "@bud/basics",
    ],
    serverComponentsExternalPackages: [
      "prisma",
      "@prisma/client",
      "postcss",
      "tailwindcss",
      "autoprefixer",
    ],
  },
};
