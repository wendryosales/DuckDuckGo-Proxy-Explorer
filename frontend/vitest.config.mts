/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        // config files
        "vitest.config.mts",
        "vitest.setup.ts",
        "next.config.ts",
        "eslint.config.mjs",
        "postcss.config.mjs",

        // build and cache dirs
        "node_modules/**",
        "dist/**",
        ".next/**",

        // types and declarations
        "**/*.d.ts",

        // style files
        "**/*.css",
        "**/*.scss",

        // utils and config files
        "src/lib/**",
        "src/styles/**",
        "src/types/**",
        "src/config/**",

        // mocks and tests
        "**/*.test.{ts,tsx}",
        "**/*.spec.{ts,tsx}",
        "**/__mocks__/**",
        "**/test/**",

        // other
        "**/stories/**",
        ".storybook/**",

        // Shadcn
        "src/components/ui/**",

        // Store
        "src/store/**",

        // Providers
        "src/providers/**",

        // Next
        "src/app/layout.tsx",
        "src/app/not-found.tsx",
        "src/app/error.tsx",
        "src/app/loading.tsx",
        "src/middleware.ts",
        "next.config.js",
        "postcss.config.js",
        "tailwind.config.ts",

        // Redux
        "src/store/**",
        "src/store/features/**",
        "src/store/hooks/**",
        "src/store/store.ts",
      ],
      reportOnFailure: true,
    },
  },
});
