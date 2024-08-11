import typescriptEslint from "@typescript-eslint/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import typescriptSortKeys from "eslint-plugin-typescript-sort-keys";
import sortKeysFix from "eslint-plugin-sort-keys-fix";
import sortDestructureKeys from "eslint-plugin-sort-destructure-keys";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends("plugin:@typescript-eslint/recommended"), {

    files: [
      "**/*.js",
      "**/*.jsx",
      "**/*.ts",
      "**/*.tsx",
    ],

    plugins: {
        "@typescript-eslint": typescriptEslint,
        "simple-import-sort": simpleImportSort,
        "typescript-sort-keys": typescriptSortKeys,
        "sort-keys-fix": sortKeysFix,
        "sort-destructure-keys": sortDestructureKeys,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",
    },

    rules: {
        "no-unused-vars": "off",

        "max-len": ["error", {
            code: 100,
        }],

        "max-lines-per-function": ["error", {
            max: 50,
        }],

        "sort-keys-fix/sort-keys-fix": "error",
        "sort-destructure-keys/sort-destructure-keys": "error",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "typescript-sort-keys/interface": "error",
        "typescript-sort-keys/string-enum": "error",
    },
}];
