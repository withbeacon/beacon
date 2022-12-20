// @ts-check
import { env } from "./src/env/server.mjs";

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return config;
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    transpilePackages: ["@bud/api", "@bud/db", "@bud/ui", "@bud/auth", "@bud/basics"],
  }
});
