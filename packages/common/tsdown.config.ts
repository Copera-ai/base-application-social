import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts", "./src/api-utils/index.ts", "./src/core/index.ts"],
  outDir: "./dist",
  format: ["esm"],
  dts: true,
  clean: true,
  treeshake: true,
  sourcemap: true,
});
