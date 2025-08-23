import baseConfig, { restrictEnvAccess } from "@paratus/eslint-config/base";
import nextjsConfig from "@paratus/eslint-config/nextjs";
import reactConfig from "@paratus/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];