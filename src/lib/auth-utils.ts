import { headers } from "next/headers";
import { getAuth } from "~/auth";

const getUser = async () => {
  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
};

export const getUserId = async () => {
  const user = await getUser();
  return user?.id
}

