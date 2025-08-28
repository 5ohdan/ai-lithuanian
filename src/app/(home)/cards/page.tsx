import { redirect } from "next/navigation";
import { getUserId } from "~/lib/auth-utils";

export default async function CardsPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  redirect("/new-pack");
}
