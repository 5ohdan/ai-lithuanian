import { redirect } from "next/navigation";
import { PackGenerator } from "~/components/pack-generator";
import { getUserId } from "~/lib/auth-utils";

export default async function NewPackPage() {
  const userId = await getUserId();

  if (!userId) {
    redirect("/signin");
  }

  return <PackGenerator />;
}
