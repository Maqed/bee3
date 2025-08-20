/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import createNextIntlPlugin from "next-intl/plugin";

if (process.env.NODE_ENV === "development") {
  await import("./src/env.js");
}

const withNextIntl = createNextIntlPlugin();

/** @type {import("next").NextConfig} */
const config = {
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(config);
