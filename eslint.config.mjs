import pluginJs from "@eslint/js";
import tsEslint from "typescript-eslint";

export default [
  {
    ignores: [".prettierrc.js"],
  },
  pluginJs.configs.recommended,
  ...tsEslint.configs.recommended,
];
