import { PacksList } from "~/components/packs-list";
import { getUserId } from "~/lib/auth-utils";
import { redirect } from "next/navigation";
import { getUserWordSets } from "~/actions/word-sets";

export default async function PacksPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/signin");
  }

  const wordsets = await getUserWordSets(userId);
  console.log(wordsets);

  return <PacksList />;
}
