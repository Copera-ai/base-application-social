import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "tests/test-setup.ts",
    globalSetup: "tests/global-setup.ts",
    testTimeout: 40 * 1000,
    hookTimeout: 900 * 1000,
  },
  plugins: [tsconfigPaths()],
  esbuild: true,
});
