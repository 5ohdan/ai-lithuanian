import { PacksList } from "~/components/packs-list";
import { getUser } from "~/lib/auth-utils";
import { redirect } from "next/navigation";

export default async function PacksPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return <PacksList />;
}
