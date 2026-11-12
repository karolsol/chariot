import pluginVue from "eslint-plugin-vue";
import vuejsAccessibility from "eslint-plugin-vuejs-accessibility";
import {
  defineConfigWithVueTs,
  vueTsConfigs,
} from "@vue/eslint-config-typescript";

export default defineConfigWithVueTs(
  {
    ignores: ["dist/**", "node_modules/**", "coverage/**"],
  },
  pluginVue.configs["flat/recommended"],
  vueTsConfigs.recommended,
  ...vuejsAccessibility.configs["flat/recommended"],
    {
    files: ["src/**/*.vue", "src/**/*.ts"],

    rules: {
      "vuejs-accessibility/alt-text": "error",
      "vuejs-accessibility/label-has-for": [
        "error",
        {
          required: {
            some: ["nesting", "id"],
          },
        },
      ],
    },
  },
);
