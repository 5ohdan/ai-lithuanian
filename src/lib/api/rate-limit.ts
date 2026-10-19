import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimitResult = { ok: true } | { ok: false };

/**
 * Per-key rate limit check backed by the Cloudflare rate limiting binding
 * (5 requests / 60s per namespace, see wrangler.jsonc).
 *
 * Fails open when the binding is unavailable (e.g. local dev without the
 * platform proxy) so the app keeps working; a missing limiter is logged.
 */
export async function checkRateLimit(key: string): Promise<RateLimitResult> {
  try {
    const context = await getCloudflareContext({ async: true });
    const limiter = context.env.RATE_LIMITER;

    if (!limiter) {
      console.error("Rate limiter binding missing — allowing request without limit");
      return { ok: true };
    }

    const { success } = await limiter.limit({ key });
    return success ? { ok: true } : { ok: false };
  } catch (error) {
    console.error("Rate limit check failed — allowing request:", error);
    return { ok: true };
  }
}
