import { createAuthClient } from "better-auth/react";

const { useSession, signIn, signOut, getSession } = createAuthClient();

export { useSession, signIn, signOut, getSession };
