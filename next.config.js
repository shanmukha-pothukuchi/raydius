/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    swcPlugins: [
      [
        "@preact-signals/safe-react/swc",
        {
          // you should use `auto` mode to track only components which uses `.value` access.
          // Can be useful to avoid tracking of server side components
          mode: "auto",
        },
      ],
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default config;
