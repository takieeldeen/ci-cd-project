import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist/"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
