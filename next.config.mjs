import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/** @type {import("next").NextConfig} */
const config = {
  reactCompiler: true,
};

/**
 * @param {string} phase
 * @returns {Promise<import("next").NextConfig>}
 */
export default async function nextConfig(phase) {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    await initOpenNextCloudflareForDev();
  }

  return config;
}
