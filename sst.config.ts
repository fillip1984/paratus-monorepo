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
      environment: {
        DATABASE_URL: process.env.DATABASE_URL,
      },
    });
  },
});
