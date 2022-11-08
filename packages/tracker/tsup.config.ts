import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: ["./src/track.ts"],
  outDir: "../../apps/web/public",
  format: ["esm"],
  splitting: false,
  minify: !options.watch,
}));
