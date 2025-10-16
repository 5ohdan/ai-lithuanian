import { PacksList } from "~/components/pack/packs-list";
import { getUserId } from "~/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function PacksPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  return <PacksList />;
}
