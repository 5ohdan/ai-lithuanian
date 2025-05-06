import { redirect } from "next/navigation";
import { PackGenerator } from "~/components/pack-generator";
import { getUser } from "~/lib/auth-utils";

export default async function NewPackPage() {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  return <PackGenerator />;
}
