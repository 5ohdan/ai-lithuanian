import { headers } from "next/headers";
import { connection } from "next/server";
import { getAuth } from "~/auth";

const getUser = async () => {
  await connection();

  const auth = await getAuth();
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user ?? null;
};

export const getUserId = async () => {
  const user = await getUser();
  return user?.id;
};
