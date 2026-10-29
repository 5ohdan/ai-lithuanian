import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Deliberately separate from vite.config.ts: unit tests do not start Cloudflare
// emulation, load .dev.vars, or use the application's deployment plugins.
export default defineConfig({
  resolve: {
    alias: { "~": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
