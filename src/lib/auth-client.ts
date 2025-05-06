import { createAuthClient } from "better-auth/react";
import { env } from "~/env";

const { useSession, signIn, signOut, getSession } = createAuthClient({
  baseURL: env.NEXT_PUBLIC_BETTER_AUTH_URL,
  redirectTo: "/new-pack",
});

const signInWithGihub = async () => {
  await signIn.social({
    provider: "github",
  });
};

const signInWithGoogle = async () => {
  await signIn.social({
    provider: "google",
  });
};

export { useSession, signInWithGihub, signInWithGoogle, signOut, getSession };
