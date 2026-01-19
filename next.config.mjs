import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

void initOpenNextCloudflareForDev();

/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
};

export default config;
