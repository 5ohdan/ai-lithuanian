import posthog from "posthog-js";
import { publicEnv } from "~/lib/public-env";

if (publicEnv.NEXT_PUBLIC_POSTHOG_KEY && publicEnv.NEXT_PUBLIC_POSTHOG_HOST) {
  posthog.init(publicEnv.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: publicEnv.NEXT_PUBLIC_POSTHOG_HOST,
    defaults: "2025-05-24",
  });
}
