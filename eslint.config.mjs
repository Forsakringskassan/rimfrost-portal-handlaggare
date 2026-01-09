import path from "node:path";
import { fileURLToPath } from "node:url";

import defaultConfig from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import vueConfig from "@forsakringskassan/eslint-config-vue";

export default [
  {
    name: "Ignored files",
    ignores: [
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/public/**",
      "**/temp/**",
      "**/typedoc/**",
    ],
  },

  ...defaultConfig,

  cliConfig(),
  typescriptConfig(),
  vueConfig(),

  {
    /* @todo technical debt */
    name: "local/technical-debt",
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "vue/no-restricted-block": "off",
      "no-console": "off",
      "no-warning-comments": "off",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          packageDir: [
            path.dirname(fileURLToPath(import.meta.url)),
            path.resolve(path.dirname(fileURLToPath(import.meta.url)), "packages/container"),
            path.resolve(path.dirname(fileURLToPath(import.meta.url)), "packages/vardAvHusdjur"),
          ],
        },
      ],
    },
  },
];
