import { createAuthClient } from "better-auth/react";

const { useSession, signIn, signOut, getSession } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  redirectTo: "/new-pack",
});

export { useSession, signIn, signOut, getSession };
