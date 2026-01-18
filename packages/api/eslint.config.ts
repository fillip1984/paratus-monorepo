import { defineConfig } from "eslint/config";

import { baseConfig } from "@paratus/eslint-config/base";

export default defineConfig(
  {
    ignores: ["dist/**"],
  },
  baseConfig,
);
