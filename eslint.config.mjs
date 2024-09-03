import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import eslintPluginUnicorn from "eslint-plugin-unicorn";

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended, eslintPluginUnicorn.configs["flat/recommended"]],
  languageOptions: {
    globals: globals.node
  },
  files: ["src/**/*.ts"]
});
