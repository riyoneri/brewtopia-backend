import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals"

export default tseslint.config({
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: {
    globals: globals.node
  },
  files: ["src"]
});
