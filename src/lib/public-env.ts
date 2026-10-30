import { z } from "zod";

function optionalSetting<T extends z.ZodType>(schema: T) {
  return z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? undefined : value),
    schema.optional(),
  );
}

const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_POSTHOG_KEY: optionalSetting(z.string().min(1)),
    NEXT_PUBLIC_POSTHOG_HOST: optionalSetting(z.url()),
  })
  .refine(
    (values) =>
      Boolean(values.NEXT_PUBLIC_POSTHOG_KEY) === Boolean(values.NEXT_PUBLIC_POSTHOG_HOST),
    { message: "Set both NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST, or neither" },
  );

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
});
