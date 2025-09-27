/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "paratus",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Nextjs("paratus", {
      domain: "paratus.illizen.com",
      path: "./apps/paratus-web",
      server: {
        runtime: "nodejs22.x",
      },
      environment: {
        DATABASE_URL: process.env.DATABASE_URL,
        AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
        AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
        AUTH_SECRET: process.env.AUTH_SECRET,
        PRODUCTION_URL: process.env.PRODUCTION_URL,
      },
    });
  },
});
