import PackView from "~/components/pack-view";
import { getUser } from "~/lib/auth-utils";
import { redirect } from "next/navigation";
export default async function PackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/signin");
  }

  const packId = (await params).id;

  return <PackView packId={packId} />;
}
