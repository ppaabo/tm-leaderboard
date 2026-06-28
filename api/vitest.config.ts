import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/"),
    },
  },
  test: {
    globalSetup: ["./tests/globalSetup.ts"],
    maxWorkers: 1,
  },
});
