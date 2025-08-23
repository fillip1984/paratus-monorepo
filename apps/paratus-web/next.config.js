// import { createJiti } from "jiti";

// const jiti = createJiti(import.meta.url);

// // Import env files to validate at build time. Use jiti so we can load .ts files in here.
// await jiti.import("./src/env");
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
    /** Enables hot reloading for local packages without a build step */
    transpilePackages: [
        "@paratus/api",
        "@paratus/auth",
        "@paratus/db",
        "@paratus/ui",
        "@paratus/validators",
    ],

    /** We already do linting and typechecking as separate tasks in CI */
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
};

export default config;
