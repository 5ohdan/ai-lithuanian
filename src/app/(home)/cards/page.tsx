import { redirect } from "next/navigation";
import { getUser } from "~/lib/auth-utils";

export default async function CardsPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  redirect("/new-pack");
}
