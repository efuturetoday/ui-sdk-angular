import angular from "angular-eslint"
import { defineConfig } from "eslint/config"

// As upstream: the framework's own rules, plus `curly` from its check-braces.
// Prettier owns layout and tsc owns types, so their rules stay off. Selectors
// are `ui` plus the part's name, as attributes.

const config = defineConfig(
  {
    ignores: [
      "vendor/**",
      "dist/**",
      ".angular/**",
      "test-results/**",
      "playwright-report/**",
    ],
  },
  {
    files: ["**/*.{ts,mts,mjs}"],
    extends: [...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      curly: ["error", "all"],
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "ui", style: "camelCase" },
      ],
      "@angular-eslint/no-input-rename": "off",
    },
  },
  {
    files: ["projects/demo/**/*.ts", "projects/playground/**/*.ts"],
    rules: {
      "@angular-eslint/component-selector": [
        "error",
        { type: ["element", "attribute"], prefix: "app", style: "kebab-case" },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
  }
)

export default config
