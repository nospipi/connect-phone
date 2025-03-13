/* eslint-disable prettier/prettier */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-plugin-prettier/recommended";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    ignores: ["dist/**", "node_modules/**"],
  },
  // Configuration for TypeScript files in src folder
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/require-await": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  // Specific configuration for root TypeScript files (without type checking)
  {
    files: ["*.ts"],
    ignores: ["src/**/*.ts"],
    languageOptions: {
      parser: tseslint.parser,
      // Not using project for non-src files to avoid type checking errors
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/require-await": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
    },
  },
  // Configuration for JavaScript files
  {
    files: ["*.js"],
    languageOptions: {
      sourceType: "module",
    },
  },
];
