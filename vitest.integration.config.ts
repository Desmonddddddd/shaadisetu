import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./src/test/db-setup.ts"],
    include: ["src/**/*.int.test.ts"],
    pool: "forks",
    // Vitest 4 moved poolOptions to top-level keys keyed by pool name. The
    // runtime accepts this; current typings don't.
    ...({ forks: { singleFork: true } } as Record<string, unknown>),
    testTimeout: 20000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
