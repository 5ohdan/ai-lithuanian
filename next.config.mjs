import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

void initOpenNextCloudflareForDev();

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    reactCompiler: true,
  },
};

export default config;
