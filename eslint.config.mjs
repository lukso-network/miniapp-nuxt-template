import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import parser from "vue-eslint-parser";
import * as espree from "espree";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      "dist",
      ".nuxt",
      ".output",
      "public/assets/fonts",
      "functions",
      "translations/",
      ".yarn",
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:vue/vue3-strongly-recommended",
      "plugin:import/recommended",
      "plugin:tailwindcss/recommended",
      "prettier"
    )
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.webextensions,
        INPAGE_SCRIPT: "readonly",
      },

      parser: parser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        parser: "@typescript-eslint/parser",
        tsconfigBaseDir: "/Users/andy/Development/example-miniapp",
        project: ["./tsconfig.json"],
        extraFileExtensions: [".vue", ".json"],
      },
    },

    settings: {
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },

    rules: {
      "vue/multi-word-component-names": "off",

      "vue/component-tags-order": [
        "error",
        {
          order: ["script", "template", "style"],
        },
      ],

      "vue/no-deprecated-slot-attribute": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],

      "no-debugger": 2,
      "no-unused-vars": "off",

      "import/order": [
        "error",
        {
          groups: [
            ["builtin", "external", "index"],
            ["sibling", "parent", "internal"],
            "object",
            "type",
          ],

          "newlines-between": "always",
        },
      ],

      "tailwindcss/no-custom-classname": [
        "error",
        {
          whitelist: [
            "paragraph-.*",
            "heading-.*",
            "nav-.*",
            "shadow-.*",
            "instagram-.*",
            "twitter-.*",
            "grid-.*",
          ],
        },
      ],
    },
  },
  ...compat.extends("plugin:playwright/playwright-test").map((config) => ({
    ...config,
    files: ["**/*.spec.ts"],
  })),
  {
    files: ["**/*.spec.ts"],

    rules: {
      "playwright/no-standalone-expect": "off",
      "playwright/no-networkidle": "off",
      "playwright/no-skipped-test": "off",
      "playwright/no-conditional-expect": "off",
    },
  },
  {
    files: ["**/dist/**/*.js", "**/.output/**/*.js"],

    rules: {
      complexity: 0,
    },
  },
  {
    files: ["./*.js", "./*.cjs"],

    languageOptions: {
      parser: espree,
      ecmaVersion: 2020,
      sourceType: "script",
    },
  },
];
