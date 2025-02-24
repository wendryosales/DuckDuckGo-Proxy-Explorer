import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.test.ts", "**/*.test.tsx", "**/test/**/*", "**/__tests__/**/*", "vitest.setup.ts", "vitest.config.mts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "jsx-a11y/alt-text": "off",
      "react-hooks/exhaustive-deps": "off",
      "testing-library/no-node-access": "off",
      "testing-library/no-container": "off",
      "@typescript-eslint/no-empty-function": "off",
      "react/display-name": "off",
    },
  },
];

export default eslintConfig;
