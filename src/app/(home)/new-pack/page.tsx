import { redirect } from "next/navigation";
import { PackGenerator } from "~/components/pack/pack-generator";
import { getUserId } from "~/lib/auth-utils";

export default async function NewPackPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  return <PackGenerator />;
}
