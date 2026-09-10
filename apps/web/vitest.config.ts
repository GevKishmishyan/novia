import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: [".next/**", "src/**/*.test.{ts,tsx}", "src/test/**", "src/app/layout.tsx"],
      include: ["src/**/*.{ts,tsx}"],
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      thresholds: {
        branches: 80,
        functions: 65,
        lines: 70,
        statements: 70,
      },
    },
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
  },
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
});
