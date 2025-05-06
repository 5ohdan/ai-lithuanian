// import { getCloudflareContext } from "@opennextjs/cloudflare";

// export async function checkRateLimit(key: string): Promise<Response | null> {
//   const { env } = await getCloudflareContext({ async: true });
//   const { success } = await env.RATE_LIMITER.limit({ key });

//   if (!success) {
//     return new Response(
//       `429 Failure – rate limit exceeded for ${key}: You have 1 request per 1 minute`,
//       { status: 429 },
//     );
//   }

//   return null;
// }
