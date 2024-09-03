import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import unusedImports from "eslint-plugin-unused-imports";

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintPluginUnicorn.configs["flat/recommended"]],
  languageOptions: {
    globals: globals.node
  },
  files: ["src/**/*.ts"],
  plugins: {
      "unused-imports": unusedImports,
  },
  rules: {
    "no-console": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "warn",
    "unused-imports/no-unused-vars": [
      "error", {
        args: "all",
        argsIgnorePattern: "^_",
        caughtErrors: "all",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "arrow-body-style": ["error", "as-needed"],
    "no-constructor-return": "error",
    "no-duplicate-imports": "error",
    "no-self-compare": "error",
    camelcase: [
      "error",
      {
        ignoreDestructuring: true,
        ignoreImports: true,
      },
    ],
    "no-else-return": "error",
    "no-lonely-if": "error",
    "no-negated-condition": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "operator-assignment": ["error", "always"],
    "prefer-arrow-callback": "error",
  }
});
