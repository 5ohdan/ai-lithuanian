import { createAuthClient } from "better-auth/react";
import { publicEnv } from "./public-env";

const { useSession, signIn, signOut, getSession } = createAuthClient({
  baseURL: publicEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
});

export { useSession, signIn, signOut, getSession };
