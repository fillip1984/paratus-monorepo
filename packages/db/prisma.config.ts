import "dotenv/config";

import { defineConfig } from "prisma/config";

// import { env } from "./src/env.js";

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
