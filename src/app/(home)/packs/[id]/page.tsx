import PackView from "~/components/pack-view";
import { getUserId } from "~/lib/auth-utils";
import { redirect } from "next/navigation";
export default async function PackPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await getUserId();

  if (!userId) {
    redirect("/login");
  }

  const packId = (await params).id;

  return <PackView packId={packId} />;
}
